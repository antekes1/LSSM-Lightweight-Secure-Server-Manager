from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List, Dict

class AlertResponse(BaseModel):
    id: int
    alert_type: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True # lub orm_mode = True

class MarkAlertRequest(BaseModel):
    token: str
    alert_id: int