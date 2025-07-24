from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    is_active: bool
    exhibition_year_id: UUID

class ProductResponse(ProductCreate):
    id: UUID