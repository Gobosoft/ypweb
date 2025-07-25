from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.contact import (CompanyContactLogCreate, CompanyContactNoteResponse, 
                                 ContactResponse, ContactUpdateSchema)
from app.crud.crud_contact import add_contact_note, update_contact_by_company_and_email, delete_contact_by_company_and_id
from app.db.session import get_db
from app.crud.crud_user import login_required
from app.models import User
from uuid import UUID
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/company-contact-note",
    response_model=CompanyContactNoteResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_company_contact_note(
    data: CompanyContactLogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        return await add_contact_note(db, data, current_user.id)
    except Exception:
        raise HTTPException(status_code=500, detail="Yhteydenottoa ei voitu tallentaa")


@router.put("/company/{company_id}", response_model=ContactResponse)
async def update_contact_by_company(
    company_id: UUID,
    data: ContactUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        return await update_contact_by_company_and_email(db, company_id, data)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Virhe päivitettäessä yhteyshenkilöä")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Yhteyshenkilön päivitys epäonnistui"
        )

@router.delete("/company/{company_id}/contact/{contact_id}", status_code=204)
async def delete_contact_by_company(
    company_id: UUID,
    contact_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        await delete_contact_by_company_and_id(db, company_id, contact_id)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Virhe poistettaessa yhteyshenkilöä")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Yhteyshenkilön poistaminen epäonnistui"
        )
