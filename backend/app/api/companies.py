from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
import logging
from app.crud.crud_user import (login_required)
from app.db.session import get_db
from fastapi import HTTPException
from models import User, Company
from schemas.company import CompanyCreate
from crud.crud_company import create_company

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/add-new", status_code=status.HTTP_201_CREATED)
def add_company(
    data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(login_required),
):
    try:
        create_company(db, data)
        return {"message": "Company added successfully."}
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected server error.")
    