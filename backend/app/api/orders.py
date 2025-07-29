from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
import logging
from app.crud.crud_user import (login_required, it_user_role_required)
from app.crud.crud_orders import (create_order, get_all_orders, update_order,
                                  get_orders_by_company_id, get_order_by_id,
                                  create_arrival_info, create_contract,
                                  create_material, create_invoice, create_order_row,
                                  get_order_rows_by_order_id, get_contracts_by_order_id,
                                  get_arrival_infos_by_order_id, get_materials_by_order_id,
                                  get_invoices_by_order_id)
from app.schemas.orders import (OrderCreate, OrderResponse, OrderUpdate, ContractCreate, MaterialCreate,
                                ArrivalInfoCreate, InvoiceCreate, OrderRowCreate,
                                OrderRowRead)
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from uuid import UUID

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_order_endpoint(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    try:
        new_order = await create_order(order, db)
        return {"message": "Order created", "order_id": str(new_order.id)}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all", response_model=List[OrderResponse])
async def fetch_all_orders(db: AsyncSession = Depends(get_db)):
    return await get_all_orders(db)

@router.put("/update/{order_id}", response_model=OrderResponse)
async def update_order_endpoint(
    order_id: UUID,
    order_data: OrderUpdate,
    db: AsyncSession = Depends(get_db)
):
    return await update_order(db, order_id, order_data)

@router.get("/company/{company_id}", response_model=list[OrderResponse])
async def get_company_orders(company_id: UUID, db: AsyncSession = Depends(get_db)):
    orders = await get_orders_by_company_id(company_id, db)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id_endpoint(order_id: UUID, db: AsyncSession = Depends(get_db)):
    order = await get_order_by_id(order_id, db)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/create-contract", status_code=status.HTTP_201_CREATED)
async def create_contract_endpoint(
    contract_data: ContractCreate, db: AsyncSession = Depends(get_db)
):
    return await create_contract(contract_data, db)

@router.post("/create-material", status_code=status.HTTP_201_CREATED)
async def create_material_endpoint(
    material_data: MaterialCreate, db: AsyncSession = Depends(get_db)
):
    return await create_material(material_data, db)

@router.post("/create-arrival-info", status_code=status.HTTP_201_CREATED)
async def create_arrival_info_endpoint(
    arrival_data: ArrivalInfoCreate, db: AsyncSession = Depends(get_db)
):
    return await create_arrival_info(arrival_data, db)

@router.post("/create-invoice", status_code=status.HTTP_201_CREATED)
async def add_invoice(
    invoice_data: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_invoice(invoice_data, db)

@router.post("/{order_id}/create-order-row", status_code=status.HTTP_201_CREATED)
async def create_order_row_endpoint(
    order_id: UUID,
    payload: OrderRowCreate,
    db: AsyncSession = Depends(get_db)
    ):
    return await create_order_row(order_id=order_id, payload=payload, db=db)

@router.get("/{order_id}/order-rows")
async def get_order_rows_by_order_id_endpoint(order_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_order_rows_by_order_id(order_id=order_id, db=db)

@router.get("/{order_id}/materials")
async def get_materials_by_order_id_endpoint(order_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_materials_by_order_id(order_id=order_id, db=db)

@router.get("/{order_id}/arrival-infos")
async def get_arrival_infos_by_order_id_endpoint(order_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_arrival_infos_by_order_id(order_id=order_id, db=db)

@router.get("/{order_id}/contracts")
async def get_contracts_by_order_id_endpoint(order_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_contracts_by_order_id(order_id=order_id, db=db)

@router.get("/{order_id}/invoices")
async def get_invoices_by_order_id_endpoint(order_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_invoices_by_order_id(order_id=order_id, db=db)