from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api import api_router
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        import redis.asyncio as aioredis
        from fastapi_limiter import FastAPILimiter
        redis_url = getattr(settings, 'REDIS_URL', "redis://localhost:6379")
        redis_conn = aioredis.from_url(redis_url, encoding="utf-8", decode_responses=True)
        await redis_conn.ping()
        await FastAPILimiter.init(redis_conn)
        print("[OK] Redis rate limiter initialized successfully")
    except Exception as e:
        print(f"[WARN] Redis not available, rate limiting disabled: {e}")
    yield
    # Shutdown (nothing to clean up)


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
def read_root():
    return {"message": "Welcome to Online Exam API"}
