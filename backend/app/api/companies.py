from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import logging

from app.crud.crud_user import login_required
from app.db.session import get_db
from app.models import User
from app.schemas.company import CompanyCreate, CompanyResponse
from app.crud.crud_company import create_company, fetch_all_companies

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/add-new", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def add_company(
    data: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        company = await create_company(db, data)
        return company
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception("Unexpected error during company creation")
        raise HTTPException(status_code=500, detail="Unexpected server error.")


@router.get("/all", response_model=List[CompanyResponse])
async def get_all_companies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        companies = await fetch_all_companies(db)
        return companies
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch companies"
        )
