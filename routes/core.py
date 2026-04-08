from datetime import timedelta, datetime, date
import os
from typing import Annotated
from fastapi import WebSocket, APIRouter, Depends, HTTPException, Request, Response
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from starlette import status
from collections import deque

import settings
from database import SessionLocal
import models
from sqlalchemy.orm.attributes import flag_modified
from routes.auth import get_current_user
from schemas.servers import GetActiveLogs, PostLog, GetArchivedLogs
from utils.alerts import TelegramProvider, AlertManager, DiscordProvider
from utils.permissions import InheritedPermissions, Perms
from settings import chat_id, telegram_bot_api, log_dir, archived_log_dir, static_vars
from schemas.core import AlertResponse, MarkAlertRequest

router = InferringRouter(
    prefix='/core-api',
    tags=['core']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

telegram = TelegramProvider(bot_token=telegram_bot_api, chat_id=chat_id)
if settings.discord_webhook_url:
    discord = DiscordProvider(webhook_url=settings.discord_webhook_url)

alert_manager = AlertManager([telegram, discord])

# vars
AGENT_LOG_DIR = f"{log_dir}/agents"
AGENT_ARCHIVE_DIR = f"{archived_log_dir}/agents"
MAX_ACTIVE_LOG_LINES = static_vars.MAX_ACTIVE_LOG_LINES
ARCHIVE_RETENTION_DAYS = static_vars.ARCHIVE_RETENTION_DAYS

# helper functions
def ensure_dirs(server_id: str):
    os.makedirs(AGENT_LOG_DIR, exist_ok=True)
    os.makedirs(f"{AGENT_ARCHIVE_DIR}/{server_id}", exist_ok=True)

def agent_log_path(server_id: str):
    return f"{AGENT_LOG_DIR}/{server_id}.log"

def write_archive_log(server_id: str, line: str):
    date = datetime.utcnow().strftime("%Y-%m-%d")
    archive_file = f"{AGENT_ARCHIVE_DIR}/{server_id}/{server_id}_{date}.log"

    with open(archive_file, "a", encoding="utf-8") as f:
        f.write(line)


def write_active_log(server_id: str, line: str):
    log_file = f"{AGENT_LOG_DIR}/{server_id}.log"

    if os.path.exists(log_file):
        with open(log_file, "r", encoding="utf-8") as f:
            lines = deque(f.readlines(), maxlen=MAX_ACTIVE_LOG_LINES)
    else:
        lines = deque(maxlen=MAX_ACTIVE_LOG_LINES)

    lines.append(line)

    with open(log_file, "w", encoding="utf-8") as f:
        f.writelines(lines)

def cleanup_archive(server_id: str):
    archive_dir = f"{AGENT_ARCHIVE_DIR}/{server_id}"
    if not os.path.exists(archive_dir):
        return

    cutoff = datetime.utcnow() - timedelta(days=ARCHIVE_RETENTION_DAYS)

    for file in os.listdir(archive_dir):
        if not file.endswith(".log"):
            continue

        try:
            date_str = file.split("_")[-1].replace(".log", "")
            file_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue

        if file_date < cutoff:
            os.remove(f"{archive_dir}/{file}")


@cbv(router)
class message_api():
    def __init__(self, db_dependency: db_dependency):
        self.db_dependency = db_dependency

    async def get_user(self, token):
        db = self.db_dependency
        data = await get_current_user(token=token, db=db)
        if 'username' in data:
            username = data['username']
            id = data['id']
            user = db.query(models.User).filter(models.User.id == id).first()
        if user is None:
            raise HTTPException(status_code=404, detail='User not found')
        return user

    @router.post("/send_alert", status_code=status.HTTP_200_OK)
    async def sent_alert(self, alert: str, alert_type: str):
        db = self.db_dependency

        await alert_manager.send(alert_type=alert_type, alert_message=alert)

        new_alert = models.Alert(
            alert_type=alert_type,
            message=alert,
            is_read=False
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)

        return {"msg": "success", "alert_id": new_alert.id}

    @router.post("/get_alerts", status_code=status.HTTP_200_OK)
    async def get_alerts(self, request: Request):
        db = self.db_dependency

        alerts = db.query(models.Alert).order_by(
            models.Alert.is_read.asc(),
            models.Alert.created_at.desc()
        ).limit(50).all()

        return {
            "msg": "success",
            "alerts": alerts
        }

    @router.post("/mark_alert_read", status_code=status.HTTP_200_OK)
    async def mark_alert_read(self, request: MarkAlertRequest):
        db = self.db_dependency
        user = await self.get_user(token=request.token)

        alert = db.query(models.Alert).filter(models.Alert.id == request.alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")

        alert.is_read = True
        db.commit()

        return {"msg": "success"}

    @router.post("/add_log", status_code=status.HTTP_200_OK)
    async def add_smt_to_logs(self, request: PostLog):
        db=self.db_dependency
        server = db.query(models.Server).filter(models.Server.token == request.token).first()
        if not server:
            raise HTTPException(status_code=404, detail='token is not valid')

        ensure_dirs(server.id)

        timestamp = datetime.utcnow().isoformat()
        line = f"{timestamp} [{request.level.upper()}] {request.message}\n"

        # 1 Append to daily archive
        write_archive_log(server.id, line)

        # 2 Maintain active ring-buffer log (150 lines)
        write_active_log(server.id, line)

        # 3 Cleanup old archive files (14 days)
        cleanup_archive(server.id)

        return {"msg": "success"}

    @router.post("/get_logs", status_code=status.HTTP_200_OK)
    async def get_active_logs(self, request: GetActiveLogs):
        path = f"{AGENT_LOG_DIR}/{request.server_id}.log"

        if not os.path.exists(path):
            return {
                "server_id": request.server_id,
                "type": "active",
                "logs": []
            }

        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        return {
            "server_id": request.server_id,
            "type": "active",
            "lines": len(lines),
            "logs": lines
        }

    @router.post("/get_archive_logs", status_code=status.HTTP_200_OK)
    async def get_archive_logs(self, request: GetArchivedLogs):
        path = f"{AGENT_ARCHIVE_DIR}/{request.server_id}/{request.server_id}_{request.date}.log"

        if not os.path.exists(path):
            raise HTTPException(
                status_code=404,
                detail="Archived log not found"
            )

        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        return {
            "server_id": request.server_id,
            "type": "archive",
            "date": request.date,
            "logs": content
        }

    @router.get("/get_archive_days/{server_id}")
    async def get_archive_days(self, server_id: str):
        archive_dir = f"{AGENT_ARCHIVE_DIR}/{server_id}"

        if not os.path.exists(archive_dir):
            return {"server_id": server_id, "days": []}

        days = []
        for file in os.listdir(archive_dir):
            if file.endswith(".log"):
                day = file.split("_")[-1].replace(".log", "")
                days.append(day)

        days.sort(reverse=True)

        return {
            "server_id": server_id,
            "days": days
        }
