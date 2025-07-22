from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
import logging
from app.models import (User)
from app.crud.crud_user import (login_required, it_user_role_required, set_access_refresh_tokens_in_cookies,
                                create_user)
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud_admin import (create_exhibition_year, get_all_exhibition_years,
                                 activate_exhibition_year)
from app.schemas.exhibition_year import (ExhibitionYearCreate)
from app.schemas.user import (UserRegistrationModel)
from sqlalchemy.exc import IntegrityError
from uuid import UUID

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
    year_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(it_user_role_required)
):
    year = await activate_exhibition_year(db=db, year_id=year_id)
    return {"message": f"Exhibition year {year.year} is now active"}

# For now create a duplicate of the register function that only IT (admin) users can use
# TODO: Remove the other register function and keep this one (?)
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request: Request, 
    response: Response, 
    user_data: UserRegistrationModel = Body(...), 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(it_user_role_required)
    ):
    logger.info("Starting registration process")
    try:
        await create_user(db_session=db, user_data=user_data)
        logger.info("Registration function completed")
        return {"message": "User successfully registered"}
    except IntegrityError:
        logger.error("Registration failed - User already exists")
        raise HTTPException(status_code=400, detail="User already exists")
    except HTTPException as e:
        logger.error(f"HTTP error during user registration: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during user registration: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected error during registration")
    