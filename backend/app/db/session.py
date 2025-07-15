from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import logging
from app.core.config import settings
import ssl

logger = logging.getLogger(__name__)

ssl_context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
ssl_context.options |= ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1
ssl_context.check_hostname = True
ssl_args = {
    "ssl": ssl_context
}

RUNNING_IN_PRODUCTION = settings.RUNNING_IN_PRODUCTION
DATABASE_URL = settings.DATABASE_URL
# Use SSL args if in production, otherwise pass None
connect_args = ssl_args if RUNNING_IN_PRODUCTION else {}

# Create the async engine with SSL configuration if in production
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args=connect_args
)
AsyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

async def get_db():
    logger.info("Creating a new database session.")
    async with AsyncSessionLocal() as session:
        yield session
    logger.info("Database session closed.")
