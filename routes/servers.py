from datetime import timedelta, datetime, date
from typing import Annotated
from fastapi import WebSocket, APIRouter, Depends, HTTPException, Request, Response, BackgroundTasks
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
import models
from sqlalchemy.orm.attributes import flag_modified
from routes.auth import get_current_user
from database import engine
from schemas.servers import ViewServers, ViewServer, AddServer, HeartbeatSchema, ShutdownModel
from utils.permissions import InheritedPermissions, Perms
from wakeonlan import send_magic_packet
from routes.core import alert_manager
import secrets

router = InferringRouter(
    prefix='/server-api',
    tags=['servers']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

async def scheuld_alert(id: int, time: int):
    import asyncio
    await asyncio.sleep(time)
    with Session(bind=engine) as session:
        server = session.query(models.Server).filter(
            models.Server.id == id).first()
        if session:
            if server.state == "online":
                return
            server.state = "error"
            session.commit()
            await alert_manager.send(alert_type="ERROR", alert_message=f"Server with id {id} failed to boot within expected time.")
    print("Data processed:")

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

    @router.post("/add_server", status_code=status.HTTP_201_CREATED)
    async def add_server(self, request: AddServer):
        db = self.db_dependency

        user = await self.get_user(token=request.token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user token"
            )
        if Perms().add_server not in InheritedPermissions().get_permissions(user.perm):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You dont have permission to do that")

        existing_server = db.query(models.Server).filter(models.Server.agent_id == request.agent_id).first()

        if existing_server:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Server with this agent_id already exists"
            )

        # generate unique server token
        server_token = secrets.token_urlsafe(32)

        exclude = ["token"]
        server = models.Server(
            **request.dict(exclude=exclude),
            token=server_token
        )

        db.add(server)
        db.commit()
        db.refresh(server)

        return {
            "msg": "server registered successfully",
            "server_id": server.id,
            "agent_id": server.agent_id,
            "server_token": server.token
        }

    @router.post("/view_servers", status_code=status.HTTP_200_OK)
    async def view_servers(self, request: ViewServers):
        db = self.db_dependency
        user = await self.get_user(token=request.token)
        servers = db.query(models.Server).all()
        return {"msg": "success"}

    @router.post("/view_server", status_code=status.HTTP_200_OK)
    async def view_server(self, request: ViewServer):
        db = self.db_dependency
        user = await self.get_user(token=request.token)
        return {"msg": "success"}

    @router.get("/wake_server/{server_id}", status_code=status.HTTP_200_OK)
    async def wake_server(self, server_id: int, background_tasks: BackgroundTasks):
        db = self.db_dependency
        server = db.query(models.Server).filter(models.Server.id == server_id).first()
        if not server:
            raise HTTPException(status_code=404, detail="Server not found")

        if server.state in ("booting", "online"):
            return {"status": "already running"}

        if not server.wol_enabled:
            raise HTTPException(status_code=400, detail="WOL disabled")
        send_magic_packet(server.mac_address)
        id = server.id
        time_to_del = timedelta(minutes=2).total_seconds()
        background_tasks.add_task(scheuld_alert, id, time_to_del)
        server.state = "booting"
        db.commit()
        return {"msg": "success", "status": "WOL sent", "state": server.state}

    @router.post("/heartbeat", status_code=status.HTTP_200_OK)
    async def heartbeat(self, data: HeartbeatSchema):
        db = self.db_dependency
        server = db.query(models.Server).filter(models.Server.token == data.token).first()

        if not server:
            raise HTTPException(status_code=404, detail="Server not found")

        server.cpu_usage = data.cpu_usage
        server.ram_usage = data.ram_usage
        server.disk_usage = data.disk_usage
        server.net_in_kbps = data.net_in_kbps
        server.net_out_kbps = data.net_out_kbps

        server.last_seen = datetime.utcnow()
        server.state = "online"

        db.commit()
        db.refresh(server)

        return {"msg": "heartbeat updated"}

    @router.post("/mark_as_down", status_code=status.HTTP_200_OK)
    async def shutdown_mark(self, data: ShutdownModel):
        db = self.db_dependency
        server = db.query(models.Server).filter(models.Server.token == data.token).first()

        if not server:
            raise HTTPException(status_code=404, detail="Server not found")

        if server.state == "offline":
            return {"msg": "server already marked as offline", "state": server.state}

        server.state = "offline"
        db.commit()
        return {"msg": "success", "state": server.state}