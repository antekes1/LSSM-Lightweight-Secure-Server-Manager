from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Table, JSON, Enum, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base
from datetime import datetime, timedelta, date

# lists
perms = ['user', "premium_user", 'moderator', 'admin', 'owner']
gender = ['male', 'female']
server_states = ['online', 'offline', 'booting', 'restarting', 'error']
types_of_invites = ["user"]

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

    # === Personal info ===
    name = Column(String(200), nullable=False)
    gender = Column(Enum(*gender, name="gender_enum"))

    age = Column(Integer, nullable=False)
    perm = Column(
        Enum(*perms, name="permission_enum"),
        default='user',
        nullable=False
    )
    security_char = Column(String(24))

class Email_verify_requests(Base):
    __tablename__ = 'verify_requests'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(250), nullable=False)
    code = Column(String(20), nullable=False, unique=True)

    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )
    expiry_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.utcnow() + timedelta(hours=24),
        nullable=False
    )

class Invite(Base):
    __tablename__ = 'invites'
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(*types_of_invites, name="invite_enum"), default='user', nullable=False)
    code = Column(String(30), nullable=False, unique=True)
    email = Column(String(250), nullable=False)


#########################################################################################################

class Server(Base):
    __tablename__ = "servers"

    # === Identity ===
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, unique=True, index=True, nullable=False)

    hostname = Column(String, index=True)
    ip_address = Column(String)
    mac_address = Column(String, index=True)
    wol_enabled = Column(Boolean)
    os = Column(String)
    arch = Column(String)       # x86_64 / arm64
    kernel = Column(String)

    # security
    token = Column(String, nullable=False, unique=True) # unical token for the server

    # === State ===
    state = Column(
        Enum(*server_states, name="server_state_enum"),
        index=True,
        default="offline",
        nullable=False
    )

    last_seen = Column(DateTime(timezone=True), index=True)
    registered_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # === Hardware (static) ===
    cpu_cores = Column(Integer)
    total_ram_mb = Column(Integer)
    total_disk_gb = Column(Integer)

    # === Live stats (last heartbeat) ===
    cpu_usage = Column(Float)        # %
    ram_usage = Column(Float)        # %
    disk_usage = Column(Float)       # %
    net_in_kbps = Column(Float)
    net_out_kbps = Column(Float)

    # === Boot / agent ===
    boot_time = Column(DateTime(timezone=True))
    agent_version = Column(String)

    # === Extra ===
    tags = Column(JSON, default=list)
    extra_data = Column(JSON)
