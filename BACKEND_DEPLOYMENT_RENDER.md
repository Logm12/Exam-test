# Backend Deployment Guide (Render)

This guide provides instructions for deploying the FastAPI backend to Render.com.

## Overview

The FDB TALENT backend requires three components:
1. **Web Service**: FastAPI application.
2. **PostgreSQL**: Primary database.
3. **Redis**: Used for rate limiting and temporary data storage.

## Step 1: PostgreSQL Database Creation

1. Access the Render Dashboard.
2. Select **New** and then **PostgreSQL**.
3. Configure the following:
   - Name: `fdb-talent-db`.
   - Region: Select the region nearest to your target audience.
   - Version: PostgreSQL 15 or higher.
4. Finalize the creation and record the **Internal Database URL**.

## Step 2: Redis Instance Creation

1. Access the Render Dashboard.
2. Select **New** and then **Redis**.
3. Configure the following:
   - Name: `fdb-talent-redis`.
   - Region: Matches your PostgreSQL region.
4. Finalize the creation and record the **Internal Redis URL**.

## Step 3: Web Service Deployment (FastAPI)

1. Select **New** and then **Web Service**.
2. Connect your Git repository.
3. Apply the following configuration:
   - **Name**: `fdb-talent-backend`.
   - **Runtime**: `Python`.
   - **Branch**: `main`.
   - **Root Directory**: `backend`.
   - **Build Command**: `pip install -r requirements.txt`.
   - **Start Command**: `alembic upgrade head && python seed_users.py && uvicorn app.main:app --host 0.0.0.0 --port 10000`.

## Step 4: Environment Variables

Configure the following environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `PYTHON_VERSION` | `3.12.0` | Forces the use of Python 3.12. |
| `DATABASE_URL` | *(Internal Database URL)* | PostgreSQL connection string. |
| `REDIS_URL` | *(Internal Redis URL)* | Redis connection string. |
| `SECRET_KEY` | *(Random string)* | Key for JWT signing. |
| `API_V1_STR` | `/api/v1` | Application API prefix. |
| `CORS_ORIGINS` | `["https://*.vercel.app"]` | Allowed frontend domains. |

## Step 5: Finalization

1. Initiate the service creation.
2. Monitor the build logs to ensure library installation and database migrations complete without error.
3. Once the status is "Live," record the public Render URL.

## Step 6: Frontend Integration

Update your frontend environment configuration (e.g., on Vercel) to point to the new backend:
- **NEXT_PUBLIC_API_URL**: `https://your-app.onrender.com/api/v1`.
