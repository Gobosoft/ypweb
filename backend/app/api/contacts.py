from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.contact import CompanyContactLogCreate, CompanyContactNoteResponse
from app.crud.crud_contact import add_contact_note
from app.db.session import get_db
from app.crud.crud_user import login_required
from app.models import User

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
