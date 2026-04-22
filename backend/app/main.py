from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api import api_router
from app.db.session import get_db
from app.db.redis import get_optional_redis
from sqlalchemy.ext.asyncio import AsyncSession
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup (Rate limiting disabled for stability)
    yield
    # Shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ExamOS Online Examination Platform API",
    version="1.2.0",
    openapi_url=settings.OPENAPI_URL,
    docs_url=settings.DOCS_URL,
    redoc_url=settings.REDOC_URL,
    lifespan=lifespan,
)

from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    try:
        err_msg = "".join(traceback.format_exception(type(exc), value=exc, tb=exc.__traceback__))
    except:
        err_msg = "".join(traceback.format_exception(exc))
    
    with open("crash.log", "a", encoding="utf-8") as f:
        f.write(f"GLOBAL ERROR: {err_msg}\n====\n")
        
    return JSONResponse(status_code=500, content={"detail": "An internal server error occurred."})

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve uploaded images
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Welcome to Online Exam API"}


@app.get(f"{settings.API_V1_STR}/health")
@app.head(f"{settings.API_V1_STR}/health")
async def health_check(
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_optional_redis)
):
    """
    System health check. Verifies DB and Redis connectivity.
    Supports HEAD requests for monitoring tools.
    """
    health_status = {
        "status": "online",
        "database": "offline",
        "redis": "offline"
    }
    
    # Check Database
    try:
        from sqlalchemy import text
        await db.execute(text("SELECT 1"))
        health_status["database"] = "online"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["database"] = f"error: {str(e)}"
        
    # Check Redis
    if redis:
        try:
            await redis.ping()
            health_status["redis"] = "online"
        except Exception as e:
            health_status["redis"] = f"error: {str(e)}"
    
    if health_status["status"] == "unhealthy":
        return JSONResponse(status_code=503, content=health_status)
        
    return health_status
