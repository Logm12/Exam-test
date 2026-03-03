# Backend Deployment Guide (Render)

This guide provides step-by-step instructions for deploying the FastAPI backend to Render.com using your GitHub repository: `https://github.com/Logm12/Exam-test.git`.

## Overview
The ExamOS backend requires three components to run:
1. **Web Service** (FastAPI)
2. **PostgreSQL** (Database)
3. **Redis** (For rate limiting and temporary draft storage)

Render is an excellent platform because it can host all three natively.

---

## Step 1: Create the Database (PostgreSQL)

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **PostgreSQL**.
3. Fill in the details:
   - Name: `examos-db`
   - Region: Select the one closest to you (e.g., Singapore).
   - PostgreSQL Version: `15` or latest.
   - Instance Type: Free (if available) or Starter.
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (it starts with `postgres://...`). You will need this later.

---

## Step 2: Create the Redis Instance

1. Go back to the Render dashboard.
2. Click **New +** and select **Redis**.
3. Fill in the details:
   - Name: `examos-redis`
   - Region: Same as your PostgreSQL database.
   - Instance Type: Free or Starter.
4. Click **Create Redis**.
5. Once created, copy the **Internal Redis URL** (it starts with `redis://...`). You will need this later.

---

## Step 3: Deploy the Web Service (FastAPI)

1. Go back to the Render dashboard.
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Connect your GitHub account (if not already connected) and search for your repository: `Logm12/Exam-test`.
5. Click **Connect**.
6. Fill in the configuration details exactly as follows:
   - **Name**: `examos-backend`
   - **Environment**: `Python`
   - **Region**: Same as your database and Redis.
   - **Branch**: `main`
   - **Root Directory**: `backend` *(CRITICAL STEP)*
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `alembic upgrade head && python seed_users.py && uvicorn app.main:app --host 0.0.0.0 --port 10000`

---

## Step 4: Configure Environment Variables

Before clicking create, scroll down and expand the **Advanced** or **Environment Variables** section. Add the following keys:

| Key | Value | Description |
|-----|-------|-------------|
| `PYTHON_VERSION` | `3.12.0` | Force Render to use Python 3.12 |
| `DATABASE_URL` | *(Paste Internal DB URL from Step 1)* | Connection to PostgreSQL |
| `REDIS_URL` | *(Paste Internal Redis URL from Step 2)* | Connection to Redis |
| `SECRET_KEY` | *(Generate a random string)* | Used for JWT signing. Example: `secret_key_examos_2026_production` |
| `API_V1_STR` | `/api/v1` | API Prefix |
| `CORS_ORIGINS` | `["https://*.vercel.app", "http://localhost:3000"]` | Allowed frontends |

*Note: Change `postgres://` to `postgresql://` in your DATABASE_URL if you encounter SQLAlchemy connection URL errors.*

---

## Step 5: Finalize and Deploy

1. Click **Create Web Service** at the bottom of the page.
2. Wait for the build and deployment process to finish (this may take 5-10 minutes).
3. Watch the logs. You should see it install dependencies, run the `alembic` migrations successfully, seed the users, and start Uvicorn.
4. Once it says "Live", look at the top left of the dashboard for your public Render URL.
   It will look something like this: `https://examos-backend.onrender.com`

---

## Step 6: Connect Frontend to Backend

Now that your backend is live, you must tell your Vercel frontend where it is.

1. Copy your new backend URL (`https://examos-backend.onrender.com`).
2. Go to your Vercel Dashboard -> Your Project -> Settings -> Environment Variables.
3. Update or Add the `NEXT_PUBLIC_API_URL` variable:
   - **Value**: `https://examos-backend.onrender.com/api/v1`
4. Redeploy your frontend on Vercel.

**Done! Your full-stack application is now live on the internet.**
