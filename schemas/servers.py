from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List, Dict

class ViewServers(BaseModel):
    token: str

class ViewServer(BaseModel):
    token: str
    id: int

class GetActiveLogs(BaseModel):
    server_id: str

class GetArchivedLogs(BaseModel):
    server_id: str
    date: str  # YYYY-MM-DD

class PostLog(BaseModel):
    token: str
    level: str # info, warning, error, test
    message: str

class AddServer(BaseModel):
    token: str  # user token
    agent_id: str
    hostname: Optional[str]
    ip_address: Optional[str]
    mac_address: Optional[str]
    wol_enabled: Optional[bool] = False
    os: Optional[str]
    arch: Optional[str]
    kernel: Optional[str]

    cpu_cores: Optional[int]
    total_ram_mb: Optional[int]
    total_disk_gb: Optional[int]

    agent_version: Optional[str]
    tags: Optional[List[str]] = []
    extra_data: Optional[Dict] = {}

class HeartbeatSchema(BaseModel):
    token: str

    cpu_usage: float
    ram_usage: float
    disk_usage: float

    net_in_kbps: Optional[float]
    net_out_kbps: Optional[float]

    boot_time: Optional[datetime]
    agent_version: Optional[str]

class ShutdownModel(BaseModel):
    token: str