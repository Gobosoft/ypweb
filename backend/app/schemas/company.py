from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class CompanyCreate(BaseModel):
    name: str
    business_id: str
    display_name: Optional[str] = None
    booth_size: Optional[str] = None
    special_requests: Optional[str] = None
    coordinator_name: Optional[str] = None

class CompanyResponse(BaseModel):
    id: UUID
    name: str
    business_id: str
    booth_size: Optional[str]
    special_requests: Optional[str]
    status: str
    display_name: Optional[str]
    project_id: UUID
    coordinator_id: Optional[UUID]

    class Config:
        orm_mode = True
        