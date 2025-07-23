from app.models import (Order, Company, ExhibitionYear, Building, Contract,
                        Material, ArrivalInfo, Invoice)
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.orders import (OrderCreate, OrderUpdate, ContractCreate, MaterialCreate, ArrivalInfoCreate,
                                InvoiceCreate)
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

async def get_orders_by_company_id(company_id: UUID, db: AsyncSession):
    result = await db.execute(select(Order).where(Order.company_id == company_id))
    return result.scalars().all()

async def get_order_by_id(order_id: UUID, db: AsyncSession) -> Order | None:
    result = await db.execute(select(Order).where(Order.id == order_id))
    return result.scalars().first()

async def get_order_or_404(order_id: UUID, db: AsyncSession) -> Order:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

async def create_contract(contract_data: ContractCreate, db: AsyncSession) -> Contract:
    await get_order_or_404(contract_data.order_id, db)

    contract = Contract(**contract_data.dict())
    db.add(contract)
    await db.commit()
    await db.refresh(contract)
    return contract

async def create_material(material_data: MaterialCreate, db: AsyncSession) -> Material:
    await get_order_or_404(material_data.order_id, db)
    
    material = Material(**material_data.dict())
    db.add(material)
    await db.commit()
    await db.refresh(material)
    return material

async def create_arrival_info(arrival_data: ArrivalInfoCreate, db: AsyncSession) -> ArrivalInfo:
    await get_order_or_404(arrival_data.order_id, db)
    
    arrival_info = ArrivalInfo(**arrival_data.dict())
    db.add(arrival_info)
    await db.commit()
    await db.refresh(arrival_info)
    return arrival_info

async def create_invoice(invoice_data: InvoiceCreate, db: AsyncSession) -> Invoice:
    await get_order_or_404(invoice_data.order_id, db)

    new_invoice = Invoice(**invoice_data.dict())
    db.add(new_invoice)
    await db.commit()
    await db.refresh(new_invoice)
    return new_invoice