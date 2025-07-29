from app.models import (ExhibitionYear, Product)
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.products import (ProductCreate)
from fastapi import HTTPException
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

async def create_product(
    product_data: ProductCreate,
    db: AsyncSession,
):
    result = await db.execute(select(ExhibitionYear).where(ExhibitionYear.id == product_data.exhibition_year_id))
    exhibition_year = result.scalar_one_or_none()

    if not exhibition_year:
        raise HTTPException(status_code=404, detail="ExhibitionYear not found")

    product = Product(
        name=product_data.name,
        price=product_data.price,
        description=product_data.description,
        is_active=product_data.is_active,
        exhibition_year_id=product_data.exhibition_year_id
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product

async def get_all_products(db: AsyncSession):
    result = await db.execute(
        select(Product).options(selectinload(Product.exhibition_year))
    )
    return result.scalars().all()

