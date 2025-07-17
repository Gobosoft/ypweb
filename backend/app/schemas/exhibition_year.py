from pydantic import BaseModel, Field
from datetime import date

class ExhibitionYearCreate(BaseModel):
    year: int
    start_date: date = Field(alias="startDate")
    end_date: date = Field(alias="endDate")

    class Config:
        populate_by_name = True
