from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
import logging
from app.crud.crud_user import (login_required, it_user_role_required)
from app.crud.crud_products import (create_product, get_all_products)
from app.schemas.products import (ProductCreate, ProductResponse)
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from uuid import UUID

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/create", response_model=ProductResponse)
async def create_product_endpoint(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_product(product_data=product_data, db=db)

@router.get("/all", response_model=list[ProductResponse])
async def get_all_products_endpoint(db: AsyncSession = Depends(get_db)):
    orders = await get_all_products(db)
    return orders