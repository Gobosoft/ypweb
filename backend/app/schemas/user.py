import re
from pydantic import BaseModel, EmailStr, validator, Field
import datetime
from typing import Optional

class UserRegistrationModel(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search("[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search("[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search("[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search("[!@#\$%\^&\*]", v):
            raise ValueError("Password must contain at least one special character (!@#$%^&*)")
        return v

    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "strongPassword123!",
            }
        }


class UserResponseModel(BaseModel):
    id: int
    email: EmailStr
    created_at: Optional[datetime.datetime] = None

    class Config:
        orm_mode = True

class EmailVerify(BaseModel):
    email: EmailStr
    token: str = Field(..., max_length=300)


class ChangePasswordEmailSchema(BaseModel):
    email: EmailStr


class ChangePasswordSchema(BaseModel):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search("[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search("[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search("[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search("[!@#\$%\^&\*]", v):
            raise ValueError("Password must contain at least one special character (!@#$%^&*)")
        return v

class UserBasicData(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


class UserSearchModel(BaseModel):
    page: int
    search: Optional[str] = None
    role: Optional[str] = None
    results_per_page: int
    