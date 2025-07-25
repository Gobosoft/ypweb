from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import logging
from uuid import UUID
from app.crud.crud_user import login_required
from app.db.session import get_db
from app.models import User
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyDetailResponse
from app.crud.crud_company import create_company, fetch_all_companies, get_company_by_id, get_company_detail_by_id

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

@router.get("/{company_id}", response_model=CompanyResponse)
async def read_company_by_id(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required)
):
    try:
        company = await get_company_by_id(db, company_id)
        return company
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error"
        )

@router.get("/detail/{company_id}", response_model=CompanyDetailResponse)
async def company_detail(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        company = await get_company_detail_by_id(db, company_id)
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        return company
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error while fetching company detail")
        raise HTTPException(status_code=500, detail="Unexpected server error")
    