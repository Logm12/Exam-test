from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ExamOS Platform API"
    API_V1_STR: str = "/api/v1"
    
    # OpenAPI Documentation settings
    OPENAPI_URL: str = "/api/v1/openapi.json"
    DOCS_URL: str = "/api/v1/docs"
    REDOC_URL: str = "/api/v1/redoc"
    
    # DB (PostgreSQL)
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "exam_user"
    POSTGRES_PASSWORD: str = "exam_password"
    POSTGRES_DB: str = "online_exam"
    POSTGRES_PORT: str = "5432"
    
    DATABASE_URL: str | None = None

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Cache (Redis)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: str = "6379"

    @property
    def REDIS_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"
    
    # JWT Auth
    SECRET_KEY: str = "examOS-super-secret-key-change-in-production-2026"
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30
    
    # CORS
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of strings
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    BACKEND_CORS_ORIGINS: List[str] = [
        "https://fdbtalent.vnuis.edu.vn",
        "http://fdbtalent.vnuis.edu.vn",
        "https://vnuis.edu.vn",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "http://112.137.143.139:3000",
        "http://112.137.143.139:8000",
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()
