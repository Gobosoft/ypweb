import logging
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from databases import Database
from dotenv import load_dotenv
import uvicorn
from app.core.config import Settings
from app.api.auth import router as auth_router
from app.api.users import router as users_router

load_dotenv()

settings = Settings()  # Instantiate Settings to access configuration

logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = settings.DATABASE_URL

RUNNING_IN_PRODUCTION = settings.RUNNING_IN_PRODUCTION
database = Database(DATABASE_URL, ssl=RUNNING_IN_PRODUCTION)

ENV = os.getenv('ENV', 'development')

# FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # List your allowed origins here
    allow_credentials=True,
    allow_methods=["*"],  # Specify allowed HTTP methods
    allow_headers=["*"],  # Specify allowed headers
)

# Include the routers with limiter applied
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.on_event("startup")
async def startup_event():
    try:
        await database.connect()
        # Establish the connection
        logger.info("Successfully connected to the database.")

    except Exception as e:
        logger.error(f"Error on startup event in main.py: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()

@app.get("/")
async def read_root():
    return {"message": "Welcome to your FastAPI application!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
