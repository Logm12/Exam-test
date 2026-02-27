# Deployment Guide

This guide explains how to deploy the ExamOS platform, specifically focusing on deploying the Next.js frontend to Vercel without errors.

## Deploying Frontend to Vercel

Vercel is the optimal hosting platform for Next.js applications. To deploy the frontend successfully without errors, follow these exact steps:

### 1. Prepare Your Repository
Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Import Project to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your ExamOS repository.

### 3. Critical Configuration (Do Not Skip)
Before clicking "Deploy", you **must** configure the following settings:

#### A. Root Directory
Since the Next.js app is inside the `frontend/` folder, tell Vercel where to look:
- Look for the **Root Directory** setting.
- Click **Edit** and select `frontend`.

#### B. Framework Preset
- Ensure **Framework Preset** is set to `Next.js`.
- Build Command: `npm run build` (Default)
- Output Directory: `.next` (Default)
- Install Command: `npm install` (Default)

#### C. Environment Variables
Expand the **Environment Variables** section and add the following keys. These are mandatory for authentication and API communication to work:

| Name | Value | Description |
|------|-------|-------------|
| `NEXTAUTH_SECRET` | *(generate a random string)* | Secret for encrypting sessions. Generate via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | The exact URL Vercel gives you (or your custom domain). Must start with `https://`. Do not add a trailing slash. |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com/api/v1` | URL of your production FastAPI backend. |

*(Note: If configuring social logins, also add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`).*

### 4. Deploy
Click the **Deploy** button. Vercel will build and assign a URL.

### 5. Post-Deployment Checklist
If you encounter errors after deployment, verify these common pitfalls:
- **500 Internal Server Error on Login**: Your `NEXTAUTH_URL` is likely incorrect or `NEXTAUTH_SECRET` is missing.
- **Network Errors (CORS or Fetch Failed)**: Ensure `NEXT_PUBLIC_API_URL` correctly points to the backend using `https://`, and the backend has configured CORS `allow_origins` to include your Vercel URL.

---

## Deploying Backend

The FastAPI backend must be deployed to a service that supports Python and PostgreSQL (e.g., Render, Railway, AWS, DigitalOcean).

1. Set up a PostgreSQL database.
2. Set up a Redis instance.
3. Configure backend environment variables (`DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `CORS_ORIGINS`).
4. Run migrations: `alembic upgrade head`.
5. Start server: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
