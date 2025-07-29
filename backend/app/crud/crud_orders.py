from app.models import (Order, Company, ExhibitionYear, Building, Contract,
                        Material, ArrivalInfo, Invoice, OrderRow, Product)
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.orders import (OrderCreate, OrderUpdate, ContractCreate, MaterialCreate, ArrivalInfoCreate,
                                InvoiceCreate, OrderRowCreate)
from fastapi import HTTPException
from sqlalchemy.future import select
from uuid import UUID
from sqlalchemy.orm import selectinload

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

async def create_order_row(order_id: UUID, payload: OrderRowCreate, db: AsyncSession) -> OrderRow:
    await get_order_or_404(order_id, db)

    result = await db.execute(select(Product).where(Product.id == payload.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    order_row = OrderRow(
        order_id=order_id,
        **payload.dict()
    )
    db.add(order_row)
    await db.commit()
    await db.refresh(order_row)

    return order_row

async def get_order_rows_by_order_id(order_id: UUID, db: AsyncSession):
    await get_order_or_404(order_id, db)

    result = await db.execute(
        select(OrderRow)
        .where(OrderRow.order_id == order_id)
        .options(selectinload(OrderRow.product))
    )
    order_rows = result.scalars().all()
    return order_rows

async def get_materials_by_order_id(order_id: UUID, db: AsyncSession):
    await get_order_or_404(order_id, db)

    result = await db.execute(select(Material).where(Material.order_id == order_id))
    materials = result.scalars().all()
    return materials

async def get_arrival_infos_by_order_id(order_id: UUID, db: AsyncSession):
    await get_order_or_404(order_id, db)

    result = await db.execute(select(ArrivalInfo).where(ArrivalInfo.order_id == order_id))
    arrival_infos = result.scalars().all()
    return arrival_infos

async def get_contracts_by_order_id(order_id: UUID, db: AsyncSession):
    await get_order_or_404(order_id, db)

    result = await db.execute(select(Contract).where(Contract.order_id == order_id))
    contracts = result.scalars().all()
    return contracts

async def get_invoices_by_order_id(order_id: UUID, db: AsyncSession):
    await get_order_or_404(order_id, db)

    result = await db.execute(select(Invoice).where(Invoice.order_id == order_id))
    invoices = result.scalars().all()
    return invoices