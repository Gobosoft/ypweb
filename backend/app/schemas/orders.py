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