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
