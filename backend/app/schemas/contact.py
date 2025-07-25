from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from app.core.utils.types import ContactStatusEnum
from datetime import datetime

class CompanyContactLogCreate(BaseModel):
    company_id: UUID
    text: str
    contact_status: Optional[ContactStatusEnum] = None
    
class CompanyContactNoteResponse(BaseModel):
    id: UUID
    company_id: UUID
    text: str
    contact_status: Optional[ContactStatusEnum]
    updated_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True
        