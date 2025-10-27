# 🚀 Quick Start với Docker

## Chạy Nhanh (1 Lệnh)

### Windows:
```cmd
START_DOCKER.bat
```

### Linux/Mac:
```bash
chmod +x START_DOCKER.sh
./START_DOCKER.sh
```

Hoặc dùng Docker Compose trực tiếp:
```bash
docker-compose up --build
```

## Truy cập

Sau khi container chạy (chờ ~30s):

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Chế độ chạy

### 1. Production Mode (Khuyến nghị)
```bash
docker-compose up --build
```
- Tối ưu hóa cho production
- Nginx serve static files
- Port 80 (Frontend) + 8000 (Backend)

### 2. Development Mode (Hot Reload)
```bash
docker-compose -f docker-compose.dev.yml up --build
```
- Code thay đổi tự động reload
- Vite dev server
- Port 5173 (Frontend) + 8000 (Backend)

## Dừng Services

```bash
# Dừng (giữ data)
docker-compose down

# Dừng và xóa data
docker-compose down -v
```

## Xem Logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

## Test API

```bash
# Health check
curl http://localhost:8000/

# Get topics
curl http://localhost:8000/topics/

# Get recommendations
curl -X POST http://localhost:8000/recommend/ \
  -H "Content-Type: application/json" \
  -d '{"target_topic": "Machine Learning", "courses_per_step": 3}'
```

Hoặc truy cập: http://localhost:8000/docs (Swagger UI)

## Troubleshooting

### Port đã được sử dụng
**Lỗi**: `port is already allocated`

**Giải pháp**: Dừng service đang dùng port hoặc đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Đổi từ 8000 sang 8001
```

### Docker không chạy
**Lỗi**: `Cannot connect to Docker daemon`

**Giải pháp**: 
- Windows: Mở Docker Desktop
- Linux: `sudo systemctl start docker`
- Mac: Mở Docker Desktop

### Backend lỗi khi start
**Kiểm tra**: 
```bash
docker-compose logs backend
```

**Thường gặp**:
- Missing `data_final_fix.csv`: Copy file vào `backend/`
- Dependencies lỗi: Rebuild image

## Requirements

- Docker Desktop (Windows/Mac)
- Docker + Docker Compose (Linux)
- Tối thiểu: 4GB RAM, 10GB disk space

## Cấu trúc

```
Data_Mining_WebDemo/
├── docker-compose.yml          # Production config
├── docker-compose.dev.yml      # Development config
├── START_DOCKER.bat            # Windows starter
├── START_DOCKER.sh             # Linux/Mac starter
├── backend/
│   ├── Dockerfile             # Backend image
│   ├── requirements.txt       # Python dependencies
│   └── data_final_fix.csv     # Data source
└── frontend/
    ├── Dockerfile             # Production image
    └── Dockerfile.dev         # Development image
```

## Tips

1. **Lần đầu chạy**: Hơi chậm (~2-5 phút) do build images
2. **Lần sau**: Nhanh hơn (<30s) do dùng cache
3. **Hot reload**: Dùng dev mode khi đang code
4. **Production**: Dùng prod mode khi deploy

## Xem thêm

- Chi tiết đầy đủ: [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
- Sequential Mining: [SEQUENTIAL_MINING_GUIDE.md](SEQUENTIAL_MINING_GUIDE.md)
- Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Câu hỏi?** Đọc [DOCKER_GUIDE.md](DOCKER_GUIDE.md) để biết thêm chi tiết!

