from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    
    MIGRATION_DB_URL: str
    DATABASE_URL: str

    ALGORITHM: str
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    RUNNING_IN_PRODUCTION: bool

    SECRET_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = "ignore"

settings = Settings()