from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
import logging
from app.models import (User)
from app.crud.crud_user import (login_required)
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud_admin import (create_exhibition_year, get_all_exhibition_years,
                                 activate_exhibition_year)
from app.schemas.exhibition_year import (ExhibitionYearCreate)

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/exhibition-years", status_code=status.HTTP_201_CREATED)
async def add_new_exhibition_year_endpoint(
    data: ExhibitionYearCreate,
    current_user: User = Depends(login_required),
    db: AsyncSession = Depends(get_db)
):
    try:
        new_year = await create_exhibition_year(db, data)
        return {"message": "Successfully added new exhibition year", "id": new_year.id}
    except HTTPException as e:
        logger.error(f"HTTP error adding exhibition year: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error adding exhibition year: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error during registration"
        )

@router.get("/exhibition-years")
async def list_exhibition_years(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required)
):
    return await get_all_exhibition_years(db=db)

@router.post("/exhibition-years/{year_id}/activate")
async def activate_exhibition_year_endpoint(
    year_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required)
):
    year = await activate_exhibition_year(db=db, year_id=year_id)
    return {"message": f"Exhibition year {year.year} is now active"}