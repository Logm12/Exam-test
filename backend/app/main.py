from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router


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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https://.*\\.vercel\\.app",
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://student.localhost:3000",
        "http://admin.localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {"message": "Welcome to Online Exam API"}
