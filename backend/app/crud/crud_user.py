from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, Depends, Request, Response
from jose import jwt, JWTError, ExpiredSignatureError
from starlette.status import HTTP_401_UNAUTHORIZED
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import logging
import uuid
from app.models import User
from app.db.session import get_db
from app.core.config import settings
from app.schemas.user import UserRegistrationModel

logger = logging.getLogger(__name__)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
HCAPTCHA_SECRET_KEY = settings.HCAPTCHA_SECRET_KEY

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_token(token: str) -> str:
    return pwd_context.hash(token)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_token(data: dict, token_type: str = "access", expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow()
    if token_type == "access":
        expire += expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    else:
        expire += expires_delta if expires_delta else timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def set_access_refresh_tokens_in_cookies(response: Response, access_token: str, refresh_token: str):
    ATES = ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert minutes to seconds
    RTES = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # Convert days to seconds
    # Set the tokens as HTTPOnly cookies
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.RUNNING_IN_PRODUCTION,
        samesite='Lax',
        path="/",
        max_age=ATES
    )
    response.set_cookie(
        key="refresh_token",
        value=f"Bearer {refresh_token}",
        httponly=True,
        secure=settings.RUNNING_IN_PRODUCTION,
        samesite='Lax',
        path="/",
        max_age=RTES
    )

async def register_user(db_session: AsyncSession, user_data: UserRegistrationModel) -> dict:
    if not user_data.email or not user_data.password or not user_data.language:
        raise HTTPException(status_code=400, detail="Email, password and language are required.")

    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_password, phone=user_data.phone,
                    language=user_data.language, organization=user_data.organization)
    db_session.add(new_user)
    await db_session.flush()  # Flush to retrieve any generated ids or data needed before commit

    # Generate and hash tokens
    access_token = create_token(data={"sub": new_user.email}, token_type='access')
    refresh_token = create_token(data={"sub": new_user.email}, token_type='refresh')
    hashed_refresh_token = hash_token(refresh_token)
    new_user.refresh_token = hashed_refresh_token

    logger.info(f"Registered new user with email: {user_data.email}")

    return {
        "user": new_user,
        "access_token": access_token,
        "refresh_token": hashed_refresh_token
    }


async def authenticate_user(db_session: AsyncSession, email: str, password: str) -> User:
    user = await get_user_by_email(db_session, email)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=404, detail="Incorrect username or password")
    if not user.is_verified:
        logger.info(f"User {email} has not verified their email.")
        raise HTTPException(status_code=401, detail="Email not verified. Please verify your email before logging in.")
    logger.info(f"User {email} authenticated.")
    return user


async def get_user_by_email(db_session: AsyncSession, email: str):
    try:
        result = await db_session.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        if not user:
            logger.info(f"User not found with email: {email}")
            raise HTTPException(status_code=404, detail="User not found")
        logger.info(f"User retrieved with email: {email}")
        return user
    except SQLAlchemyError as e:
        logger.error(f"Database error occurred while retrieving user by email {email}: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def verify_refresh_token_and_get_user(db: AsyncSession, refresh_token: str) -> User:
    try:
        if refresh_token.startswith("Bearer "):
            refresh_token = refresh_token[7:]  # Remove 'Bearer ' from the start
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_identity = payload.get("sub")
        if user_identity is None:
            raise HTTPException(status_code=401, detail="Invalid token payload.")
    except JWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    try:
        result = await db.execute(select(User).filter(User.email == user_identity))
        user = result.scalars().first()
        if user is None or not pwd_context.verify(refresh_token, user.refresh_token):
            raise HTTPException(status_code=401, detail="Invalid refresh token or user not found.")
        return user
    except SQLAlchemyError as e:
        logger.error(f"Database error occurred: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")


def get_token_from_cookie(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    # Remove 'Bearer ' prefix if present (common in headers, unusual in cookies)
    if token.startswith("Bearer "):
        token = token[7:]  # Remove 'Bearer ' from the start
    logger.info(f"Token: {token}")
    return token


async def fetch_user(user_id: str, db: AsyncSession):
    try:
        result = await db.execute(select(User).filter_by(email=user_id))  # Assuming 'sub' is the user email
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:  # Catch any other exceptions that might occur
        logger.error(f"Error fetching user: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user data")


async def get_current_user(token: str = Depends(get_token_from_cookie), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        user = await fetch_user(user_id, db)
        return user
    except ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token expired")
    except JWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except HTTPException as e:  # This catches HTTP exceptions you raise explicitly
        raise e
    except Exception as e:  # Generic exception handler, for unexpected errors
        logger.error(f"Unhandled error in get_current_user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


def login_required(user: User = Depends(get_current_user)):
    return user


def generate_verification_token():
    return str(uuid.uuid4())


async def set_verification_token(db_session: AsyncSession, user_email: str, token: str):
    try:
        logger.info("Attempting to query user")
        result = await db_session.execute(select(User).filter(User.email == user_email))
        user = result.scalars().first()
        logger.info(f"User fetched: {user}")

        if user:
            user.email_verification_token = token
            user.email_token_created_at = datetime.now(timezone.utc)
            logger.info("Verification token and timestamp set on user object.")
    except Exception as e:
        await db_session.rollback()
        logger.error(f"Failed to set verification token: {e}")
        raise e
