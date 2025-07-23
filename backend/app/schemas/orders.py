from pydantic import BaseModel
from uuid import UUID
from datetime import date
from app.core.utils.types import (OrderType, OrderStatus)
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