@echo off
title FDB TALENT - Dev Server Launcher
echo ==========================================
echo   FDB TALENT - Starting Dev Servers
echo ==========================================
echo.

REM Check if docker containers are running (postgres + redis)
echo [1/3] Checking Docker services (PostgreSQL + Redis)...
docker ps --filter "name=online-exam-db" --filter "status=running" -q >nul 2>&1
if errorlevel 1 (
    echo       Starting Docker containers...
    cd /d "%~dp0"
    docker-compose up -d
    echo       Waiting for services to be ready...
    timeout /t 3 /nobreak >nul
) else (
    echo       Docker services already running.
)
echo.

REM Start Backend in a new window
echo [2/3] Starting Backend (FastAPI @ port 8000)...
start "FDB TALENT - Backend" cmd /k "title FDB TALENT Backend && cd /d "%~dp0backend" && call conda activate FDBTa && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
echo       Backend starting in new window...
timeout /t 3 /nobreak >nul
echo.

REM Start Frontend in a new window
echo [3/3] Starting Frontend (Next.js @ port 3000)...
start "FDB TALENT - Frontend" cmd /k "title FDB TALENT Frontend && cd /d "%~dp0frontend" && npm run dev"
echo       Frontend starting in new window...
echo.

echo ==========================================
echo   Both servers are starting!
echo   - Backend:  http://127.0.0.1:8000
echo   - Frontend: http://localhost:3000
echo   - API Docs: http://127.0.0.1:8000/api/v1/docs
echo ==========================================
echo.
echo Press any key to exit this launcher window...
pause >nul
