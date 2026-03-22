import json
import redis.asyncio as redis
from app.core.config import settings

# Dependency for Redis connection
async def get_redis():
    redis_client = redis.from_url(
        f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}",
        decode_responses=True
    )
    try:
        yield redis_client
    finally:
        await redis_client.aclose()

# Optional Redis dependency that returns None if connection fails
async def get_optional_redis():
    try:
        redis_client = redis.from_url(
            f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}",
            decode_responses=True
        )
        # Try a quick ping to verify connection
        async with redis_client.client() as conn:
            await conn.ping()
        
        try:
            yield redis_client
        finally:
            await redis_client.aclose()
    except Exception as e:
        print(f"[WARN] Redis optional connection failed: {e}")
        yield None
