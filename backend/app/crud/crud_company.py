from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from typing import List
from uuid import UUID
from app.models import Company, ExhibitionYear, User, Order
from app.schemas.company import CompanyCreate, CompanyDetailResponse
from app.schemas.contact import ContactResponse
from app.core.utils.types import CompanyStatus


async def create_company(db: AsyncSession, data: CompanyCreate) -> Company:
    # Hae uusin messuprojekti
    result = await db.execute(select(ExhibitionYear).order_by(desc(ExhibitionYear.year)))
    exhibition_year = result.scalars().first()
    if not exhibition_year:
        raise HTTPException(status_code=404, detail="No exhibition year available")

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
        exhibition_year_id=exhibition_year.id,
        coordinator_id=coordinator_id,
    )

    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company


async def fetch_all_companies(db: AsyncSession) -> List[Company]:
    result = await db.execute(select(Company))
    return result.scalars().all()


async def get_company_by_id(db: AsyncSession, company_id: UUID) -> Company:
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalars().first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

    return company

async def get_company_detail_by_id(db: AsyncSession, company_id: UUID) -> CompanyDetailResponse:
    result = await db.execute(
        select(Company)
        .options(
            joinedload(Company.contacts),
            joinedload(Company.coordinator),
            joinedload(Company.contact_logs),
            joinedload(Company.orders).joinedload(Order.contracts),
            joinedload(Company.orders).joinedload(Order.materials),
            joinedload(Company.orders).joinedload(Order.arrival_infos),
            joinedload(Company.orders).joinedload(Order.invoices),
            joinedload(Company.contacts),
        )
        .filter(Company.id == company_id)
    )
    company = result.scalars().first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    order = company.orders[0] if company.orders else None

    latest_log = (
        sorted(company.contact_logs, key=lambda log: log.updated_at, reverse=True)[0]
        if company.contact_logs else None
    )

    return CompanyDetailResponse(
        id=company.id,
        name=company.name,
        display_name=company.display_name,
        business_id=company.business_id,
        booth_size=company.booth_size,
        coordinator_name=company.coordinator.name if company.coordinator else None,
        contact_received=bool(company.contact_logs),
        contract_returned_date=order.contracts[0].returned_date if order and order.contracts else None,
        arrival_info_date=order.arrival_infos[0].returned_date if order and order.arrival_infos else None,
        invoice_sent_date=next((i.date for i in order.invoices if i.is_sent), None) if order else None,
        invoice_paid_date=next((i.date for i in order.invoices if i.is_paid), None) if order else None,
        special_requests=company.special_requests,
        material_returned_date=order.materials[0].returned_date if order and order.materials else None,
        first_day_booth=company.booth_size,
        second_day_booth=None,
        contacts=[ContactResponse.from_orm(contact) for contact in company.contacts],
        latest_contact_log={
            "text": latest_log.text,
            "updated_at": latest_log.updated_at,
            "contact_status": latest_log.contact_status,
        } if latest_log else None
    )
