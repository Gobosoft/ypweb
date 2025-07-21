from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.schemas.exhibition_year import ExhibitionYearCreate
from app.models import ExhibitionYear
from uuid import UUID

async def create_exhibition_year(db_session: AsyncSession, data: ExhibitionYearCreate):
    stmt = select(ExhibitionYear).where(ExhibitionYear.year == data.year)
    result = await db_session.execute(stmt)
    existing = result.scalars().first()

    if existing:
        raise HTTPException(status_code=400, detail="Exhibition year already exists.")

    new_year = ExhibitionYear(
        year=data.year,
        start_date=data.start_date,
        end_date=data.end_date,
    )
    db_session.add(new_year)
    await db_session.commit()
    await db_session.refresh(new_year)
    return new_year

async def get_all_exhibition_years(db: AsyncSession):
    result = await db.execute(select(ExhibitionYear).order_by(ExhibitionYear.year.desc()))
    return result.scalars().all()

async def activate_exhibition_year(db: AsyncSession, year_id: UUID):
    year = await db.get(ExhibitionYear, year_id)
    if not year:
        raise HTTPException(status_code=404, detail="Exhibition year not found")

    # Set is_active = True for the selected year
    year.is_active = True
    db.add(year)
    await db.commit()
    await db.refresh(year)

    return year