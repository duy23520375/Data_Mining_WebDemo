#!/bin/bash

echo "========================================"
echo " Udemy Bestseller Predictor"
echo " Docker Deployment"
echo "========================================"
echo ""

# Kiểm tra Docker đã được cài đặt chưa
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker chưa được cài đặt!"
    echo "Vui lòng cài đặt Docker từ: https://docs.docker.com/get-docker/"
    exit 1
fi

# Kiểm tra Docker Compose đã được cài đặt chưa
if ! command -v docker-compose &> /dev/null; then
    echo "[ERROR] Docker Compose chưa được cài đặt!"
    echo "Vui lòng cài đặt Docker Compose từ: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "[1/3] Đang kiểm tra Docker..."
if ! docker ps &> /dev/null; then
    echo "[ERROR] Docker Engine chưa chạy!"
    echo "Vui lòng khởi động Docker và thử lại."
    exit 1
fi

echo "[2/3] Đang build và khởi động containers..."
if ! docker-compose up -d --build; then
    echo "[ERROR] Khởi động thất bại!"
    exit 1
fi

echo ""
echo "[3/3] Đang chờ services sẵn sàng..."
sleep 10

echo ""
echo "========================================"
echo " THÀNH CÔNG! Ứng dụng đã sẵn sàng"
echo "========================================"
echo ""
echo "  Frontend:  http://localhost"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "========================================"
echo ""
echo "Để dừng ứng dụng, chạy lệnh:"
echo "  docker-compose down"
echo ""

# Tự động mở browser (nếu có)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost &> /dev/null
elif command -v open &> /dev/null; then
    open http://localhost &> /dev/null
fi


