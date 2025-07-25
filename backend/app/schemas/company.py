from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date
from app.core.utils.types import ContactStatusEnum
from datetime import datetime

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
    exhibition_year_id: UUID
    coordinator_id: Optional[UUID]

    class Config:
        orm_mode = True

class CompanyContactLogPreview(BaseModel):
    text: str
    updated_at: datetime
    contact_status: Optional[ContactStatusEnum]

class CompanyDetailResponse(BaseModel):
    id: UUID
    name: str
    display_name: Optional[str]
    business_id: str
    booth_size: Optional[str]
    coordinator_name: Optional[str]
    contact_received: bool
    contract_returned_date: Optional[date]
    arrival_info_date: Optional[date]
    invoice_sent_date: Optional[date]
    invoice_paid_date: Optional[date]
    special_requests: Optional[str]
    material_returned_date: Optional[date]
    first_day_booth: Optional[str]
    second_day_booth: Optional[str]
    latest_contact_log: Optional[CompanyContactLogPreview]

    class Config:
        orm_mode = True
        