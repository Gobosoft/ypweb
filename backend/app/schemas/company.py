from pydantic import BaseModel
from typing import Optional


class CompanyCreate(BaseModel):
    name: str
    business_id: str
    display_name: Optional[str] = None
    booth_size: Optional[str] = None
    special_requests: Optional[str] = None
    status: str
    project_id: int
    coordinator_name: Optional[str] = None
    