import redis.asyncio as redis
from app.core.config import settings

# Global redis pool to be reused across requests
_redis_pool = redis.ConnectionPool.from_url(
    settings.ASYNC_REDIS_URL,
    decode_responses=True,
    max_connections=20,
    socket_connect_timeout=2,
    socket_timeout=2
)

def get_redis_client():
    return redis.Redis(connection_pool=_redis_pool)

# Dependency for Redis connection
async def get_redis():
    client = get_redis_client()
    try:
        yield client
    finally:
        # With a pool, we don't necessarily want to close the client 
        # which would close the connection. Redis-py handles pool returns.
        pass

# Optional Redis dependency that returns None if connection fails
async def get_optional_redis():
    client = get_redis_client()
    try:
        # Verify connection exists with a quick ping
        await client.ping()
        yield client
    except Exception as e:
        print(f"[WARN] Redis optional connection failed: {e}")
        yield None

