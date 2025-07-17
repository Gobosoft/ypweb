from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
import logging
from app.models import (User)
from app.crud.crud_user import (login_required)
from app.schemas.user import (UserResponseModel, UserStateResponseModel)

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/me", response_model=UserResponseModel)
async def read_user_me(current_user: User = Depends(login_required)):
    return current_user


@router.get("/me/state", response_model=UserStateResponseModel)
async def read_user_me_state(current_user: User = Depends(login_required)):
    try:
        return {"userData": current_user}
    except HTTPException as e:
        logger.error(f"HTTP error getting user state: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error getting user state: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to user state due to an error.")
