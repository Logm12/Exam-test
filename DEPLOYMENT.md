# Deployment Guide

This guide describes the procedures for deploying the FDB TALENT platform, focusing on the Next.js frontend deployment to Vercel.

## Frontend Deployment (Vercel)

Vercel is the recommended hosting platform for the Next.js application. Follow these instructions for a successful deployment:

### 1. Repository Preparation
Ensure the latest code is pushed to a connected Git repository.

### 2. Vercel Project Import
1. Log in to the Vercel Dashboard.
2. Select **Add New** and then **Project**.
3. Import the FDB TALENT repository.

### 3. Essential Configuration
Configure the following settings before initiating the deployment:

#### Root Directory
Set the **Root Directory** to `frontend`.

#### Framework and Build Settings
- **Framework Preset**: Next.js.
- **Build Command**: `npm run build`.
- **Output Directory**: `.next`.
- **Install Command**: `npm install`.

#### Environment Variables
Add the following mandatory environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `NEXTAUTH_SECRET` | *(random string)* | Encryption key for session management. |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | The production URL of your application. |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.com/api/v1` | The production URL of the FastAPI backend. |

### 4. Deployment
Select **Deploy** to begin the build process.

### 5. Post-Deployment Verification
If issues occur, verify the following:
- **Authentication Errors**: Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
- **Network Failures**: Ensure `NEXT_PUBLIC_API_URL` uses `https://` and that the backend CORS configuration includes the frontend URL.

## Backend Deployment

The FastAPI backend requires an environment supporting Python and PostgreSQL (e.g., Render, Railway, or AWS).

1. Provision a PostgreSQL database and a Redis instance.
2. Configure environment variables (`DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `CORS_ORIGINS`).
3. Execute database migrations using `alembic upgrade head`.
4. Start the server using Uvicorn on the designated port.
