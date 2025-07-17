from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from fastapi import HTTPException
from typing import List

from app.models import Company, ExhibitionYear, User
from app.schemas.company import CompanyCreate
from app.core.utils.types import CompanyStatus


async def create_company(db: AsyncSession, data: CompanyCreate) -> Company:
    # Hae uusin messuprojekti
    result = await db.execute(select(ExhibitionYear).order_by(desc(ExhibitionYear.year)))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="No exhibition project available")

    # Tarkista duplikaatti Y-tunnuksella
    result = await db.execute(select(Company).filter(Company.business_id == data.business_id))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=409, detail="Company with this business_id already exists")

    coordinator_id = None
    status = CompanyStatus.UNRESERVED

    if data.coordinator_name:
        result = await db.execute(select(User).filter(User.name == data.coordinator_name))
        coordinator = result.scalars().first()
        if coordinator:
            coordinator_id = coordinator.id
            status = CompanyStatus.RESERVED
        else:
            raise HTTPException(status_code=404, detail="Coordinator not found")

    company = Company(
        name=data.name,
        business_id=data.business_id,
        display_name=data.display_name or data.name,
        booth_size=data.booth_size,
        special_requests=data.special_requests,
        status=status.value,
        project_id=project.id,
        coordinator_id=coordinator_id,
    )

    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company


async def fetch_all_companies(db: AsyncSession) -> List[Company]:
    result = await db.execute(select(Company))
    return result.scalars().all()
