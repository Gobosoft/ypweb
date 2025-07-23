from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
import logging
from app.crud.crud_user import (login_required, it_user_role_required)
from app.crud.crud_orders import (create_order, get_all_orders, update_order)
from app.schemas.orders import (OrderCreate, OrderResponse, OrderUpdate)
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