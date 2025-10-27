@echo off
REM Start Docker containers for Udemy Sequential Mining WebDemo
REM Windows Batch Script

echo ========================================
echo  Starting Udemy WebDemo with Docker
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [INFO] Docker is ready!
echo.

REM Ask user for mode
echo Select mode:
echo 1. Production (optimized, recommended)
echo 2. Development (hot reload)
echo.
set /p mode="Enter choice (1 or 2): "

if "%mode%"=="2" (
    echo.
    echo [INFO] Starting in DEVELOPMENT mode...
    echo [INFO] Frontend will be at: http://localhost:5173
    echo [INFO] Backend will be at: http://localhost:8000
    echo [INFO] Hot reload enabled for both services
    echo.
    docker-compose -f docker-compose.dev.yml up --build
) else (
    echo.
    echo [INFO] Starting in PRODUCTION mode...
    echo [INFO] Frontend will be at: http://localhost
    echo [INFO] Backend will be at: http://localhost:8000
    echo.
    docker-compose up --build
)

echo.
echo [INFO] Containers stopped.
pause

