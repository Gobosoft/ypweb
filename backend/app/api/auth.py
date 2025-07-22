from fastapi import APIRouter, Depends, HTTPException, Body, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import logging
from app.crud.crud_user import (
    authenticate_user, verify_refresh_token_and_get_user, register_user,
    create_token, login_required, hash_token, set_access_refresh_tokens_in_cookies,
    generate_verification_token, set_verification_token, verify_user, get_user_by_token,
    get_user_by_email,
)
from app.db.session import get_db
from app.models import User
from app.schemas.user import UserRegistrationModel, UserResponseModel, ChangePasswordEmailSchema, ChangePasswordSchema
import os
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
# @limiter.limit("2/minute")
async def register(
    request: Request, 
    response: Response, 
    user_data: UserRegistrationModel = Body(...), 
    db: AsyncSession = Depends(get_db)):
    logger.info("Starting registration process")

    async with db.begin():
        try:
            registration_result = await register_user(db_session=db, user_data=user_data)
            logger.info("Registration function completed")
            # For now lets skip the email verification
            """
            verification_token = generate_verification_token()
            logger.info(f"Generated verification token {verification_token}")

            email = registration_result['user'].email

            await set_verification_token(db, email, verification_token)
            logger.info("Verification token set")
            """
            # if os.getenv("ENVIRONMENT") != "test":
                # send_verification_email.delay(email, verification_token, language)

            access_token = registration_result["access_token"]
            refresh_token = registration_result["refresh_token"]

            set_access_refresh_tokens_in_cookies(response, access_token, refresh_token)
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
        

@router.get("/verify-email/{token}")
# @limiter.limit("2/minute")
async def verify_email(
    request: Request, 
    token: str, 
    db: AsyncSession = Depends(get_db)
    ):
    async with db.begin():  # Manage transaction here
        user = await get_user_by_token(db, token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user = await verify_user(user)
        if not user:
            raise HTTPException(status_code=404, detail="Token expired and cleared")
    
    return {"message": "Email successfully verified. You can now login."}


@router.post("/login", response_model=UserResponseModel)
# @limiter.limit("3/minute")
async def login_for_access_token(
    request: Request, 
    response: Response,
    db: AsyncSession = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
    ):
    try:
        async with db as session:
            # Authenticate the user
            user = await authenticate_user(session, form_data.username, form_data.password)

            # Token creation and hashing the refresh token
            access_token = create_token(data={"sub": user.email}, token_type="access")
            refresh_token = create_token(data={"sub": user.email}, token_type="refresh")
            hashed_refresh_token = hash_token(refresh_token)

            # Update the user's hashed refresh token in the database
            user.refresh_token = hashed_refresh_token
            user_email = user.email
            await session.commit()  # Ensure we commit this change
            await session.refresh(user)

            # Set access and refresh tokens in cookies
            set_access_refresh_tokens_in_cookies(response, access_token, refresh_token)
            
            logger.info(f"User {user_email} logged in successfully.")
            return user
    except HTTPException as e:
        await db.rollback()
        logger.error(f"HTTP error during login attempt: {e.detail}")
        raise e
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error during login attempt: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected error during login")


@router.post("/logout")
async def logout(
    response: Response, 
    user: User = Depends(login_required), 
    db: AsyncSession = Depends(get_db)
    ):
    try:
        async with db as session:
            user.is_refresh_token_revoked = True
            session.add(user)
            await session.commit()
            
            # Clear the access and refresh token cookies
            response.delete_cookie(key="access_token", path="/")
            response.delete_cookie(key="refresh_token", path="/")

            return {"message": "User logged out successfully."}
    except SQLAlchemyError as e:
        logger.error(f"Database error during logout for user {user.email}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to logout properly.")


@router.post("/logout/automatic")
async def automatic_logout(response: Response, db: AsyncSession = Depends(get_db)):
    try:
        # No user dependency here
        # Clear the access and refresh token cookies
        response.delete_cookie(key="access_token", path="/")
        response.delete_cookie(key="refresh_token", path="/")

        return {"message": "User logged out automatically due to inactivity."}
    except SQLAlchemyError as e:
        logger.error(f"Database error during automatic logout: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to logout properly.")


@router.post("/token/refresh")
async def refresh_access_token(
    request: Request, 
    response: Response, 
    db: AsyncSession = Depends(get_db)
    ):
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is missing")

    try:
        user = await verify_refresh_token_and_get_user(db, refresh_token)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        access_token = create_token(data={"sub": user.email}, token_type='access')
        new_refresh_token = create_token(data={"sub": user.email}, token_type='refresh')

        hashed_new_refresh_token = hash_token(new_refresh_token)
        user.refresh_token = hashed_new_refresh_token
        await db.commit()

        set_access_refresh_tokens_in_cookies(response, access_token, new_refresh_token)

        return {"accessToken": access_token}
    except HTTPException as e:
        logger.error(f"HTTP exception: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unhandled exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    
@router.post("/change-password/send-email")
# @limiter.limit("2/minute")
async def change_password_mailer(
    request: Request, 
    email_data: ChangePasswordEmailSchema = Body(...),
    db: AsyncSession = Depends(get_db)
    ):
    async with db.begin():
        try:
            user = await get_user_by_email(db_session=db, email=email_data.email)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            # await send_password_change_email(user, db)
            return {"message": "Email sent successfully"}
        except HTTPException as e:
            logger.error(f"HTTP exception: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Unhandled exception: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.post("/resend-verification")
# @limiter.limit("2/minute")
async def resend_verification_email(
    request: Request, 
    email: str = Body(..., embed=True), 
    db: AsyncSession = Depends(get_db)
    ):
    async with db.begin():
        try:
            user = await get_user_by_email(db, email)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            if user.is_verified:
                raise HTTPException(status_code=400, detail="Email is already verified")

            verification_token = generate_verification_token()
            await set_verification_token(db, email, verification_token)
            # if os.getenv("ENVIRONMENT") != "test":
                # language = await get_user_language(db_session=db, email=email)
                # send_verification_email.delay(email, verification_token, language)

            return {"message": "Verification email sent successfully"}
        except HTTPException as e:
            logger.error(f"HTTP exception: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Unhandled exception: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
