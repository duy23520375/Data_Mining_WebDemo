@echo off
echo ========================================
echo  Udemy Bestseller Predictor
echo  Docker Deployment
echo ========================================
echo.

REM Kiểm tra Docker đã được cài đặt chưa
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker chua duoc cai dat!
    echo Vui long cai dat Docker Desktop tu: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [1/3] Dang kiem tra Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Engine chua chay!
    echo Vui long khoi dong Docker Desktop va thu lai.
    pause
    exit /b 1
)

echo [2/3] Dang build va khoi dong containers...
docker-compose up -d --build

if errorlevel 1 (
    echo [ERROR] Khoi dong that bai!
    pause
    exit /b 1
)

echo.
echo [3/3] Dang cho services san sang...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo  THANH CONG! Ung dung da san sang
echo ========================================
echo.
echo  Frontend:  http://localhost
echo  Backend:   http://localhost:8000
echo  API Docs:  http://localhost:8000/docs
echo.
echo ========================================
echo.
echo Nhan phim bat ky de mo browser...
pause >nul

start http://localhost

echo.
echo De dung ung dung, chay lenh:
echo   docker-compose down
echo.
pause


