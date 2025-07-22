from pydantic import BaseModel

class BuildingCreate(BaseModel):
    name: str
    location: str