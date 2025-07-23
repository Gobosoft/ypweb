from pydantic import BaseModel
from uuid import UUID
from datetime import date
from app.core.utils.types import (OrderType, OrderStatus, MaterialType)
from typing import Optional

class OrderCreate(BaseModel):
    order_date: date
    order_type: OrderType
    status: OrderStatus
    attendance_confirmed: Optional[bool] = None
    portal_uuid: str
    company_id: UUID
    exhibition_year_id: UUID
    building_id: UUID

class OrderResponse(BaseModel):
    id: UUID
    order_date: date
    order_type: OrderType
    status: OrderStatus
    attendance_confirmed: bool
    portal_uuid: str
    company_id: UUID
    exhibition_year_id: UUID
    building_id: UUID

    class Config:
        orm_mode = True

class OrderUpdate(BaseModel):
    order_date: Optional[date] = None
    order_type: Optional[OrderType] = None
    status: Optional[OrderStatus] = None
    attendance_confirmed: Optional[bool] = None
    portal_uuid: Optional[str] = None
    company_id: Optional[UUID] = None
    exhibition_year_id: Optional[UUID] = None
    building_id: Optional[UUID] = None

class ContractCreate(BaseModel):
    file_name: str
    file_path: str
    is_returned: Optional[bool] = False
    is_signed: Optional[bool] = False
    returned_date: date
    order_id: UUID

class MaterialCreate(BaseModel):
    type: MaterialType
    file_name: str
    file_path: str
    returned_date: date
    order_id: UUID

class ArrivalInfoCreate(BaseModel):
    lunch_count: Optional[float]
    dietary_restrictions: Optional[str]
    cocktail_count: Optional[float]
    goods_sending: Optional[str]
    returned_date: date
    order_id: UUID

class InvoiceCreate(BaseModel):
    order_id: UUID
    sum: float
    invoice_date: date
    due_date: date
    is_sent: bool
    is_paid: Optional[bool] = False
    reference: str
    special_info: Optional[str] = None

class OrderRowCreate(BaseModel):
    product_id: UUID
    amount: float
    unit_price: float

class OrderRowRead(BaseModel):
    id: UUID
    order_id: UUID
    product_id: UUID
    amount: float
    unit_price: float

    class Config:
        orm_mode = True