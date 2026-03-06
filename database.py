from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from settings import url_database

engine = create_engine(
    url_database,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()