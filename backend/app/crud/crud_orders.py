from app.models import (Order, Company, ExhibitionYear, Building)
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.orders import (OrderCreate, OrderUpdate)
from fastapi import HTTPException
from sqlalchemy.future import select
from uuid import UUID

async def create_order(order_data: OrderCreate, db: AsyncSession) -> Order:

    # Check if company exists
    company = await db.scalar(select(Company).where(Company.id == order_data.company_id))
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Check if exhibition year exists
    exhibition_year = await db.scalar(
        select(ExhibitionYear).where(ExhibitionYear.id == order_data.exhibition_year_id)
    )
    if not exhibition_year:
        raise HTTPException(status_code=404, detail="Exhibition year not found")

    # Check if building exists
    building = await db.scalar(
        select(Building).where(Building.id == order_data.building_id)
    )
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    new_order = Order(
        order_date=order_data.order_date,
        order_type=order_data.order_type,
        status=order_data.status,
        attendance_confirmed=order_data.attendance_confirmed,
        portal_uuid=order_data.portal_uuid,
        company_id=order_data.company_id,
        exhibition_year_id=order_data.exhibition_year_id,
        building_id=order_data.building_id,
    )
    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)
    return new_order

async def get_all_orders(db: AsyncSession):
    result = await db.execute(select(Order))
    return result.scalars().all()

async def update_order(
    db: AsyncSession, order_id: UUID, order_data: OrderUpdate
) -> Order:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=404, detail="Order not found"
        )

    for key, value in order_data.dict(exclude_unset=True).items():
        setattr(order, key, value)

    await db.commit()
    await db.refresh(order)
    return order