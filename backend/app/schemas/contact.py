from pydantic import BaseModel, EmailStr
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
        
class ContactResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: Optional[str]
    description: Optional[str]
    is_primary: bool

    class Config:
        from_attributes = True 
        
class ContactUpdateSchema(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    description: Optional[str] = None
    is_primary: bool
    
    class Config:
        orm_mode = True
        