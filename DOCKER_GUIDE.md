# 🐳 Docker Deployment Guide - Sequential Mining WebDemo

## Tổng quan

Hệ thống bao gồm:
- **Backend**: FastAPI + Sequential Mining (Python)
- **Frontend**: React + Vite + Nginx
- **Data**: 10,181 Udemy courses

## Quick Start (Chạy ngay)

### 1. Chạy toàn bộ với Docker Compose

```bash
# Từ thư mục Data_Mining_WebDemo
cd Data_Mining_WebDemo

# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở background
docker-compose up -d --build
```

**Sau khi chạy:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 2. Dừng services

```bash
# Dừng services
docker-compose down

# Dừng và xóa volumes (reset database)
docker-compose down -v
```

## Chi tiết Services

### Backend Service
- **Port**: 8000
- **Container**: `udemy-predictor-backend`
- **Technologies**: 
  - FastAPI
  - SQLAlchemy
  - XGBoost
  - NetworkX (Sequential Mining)
  - PrefixSpan
- **Data**: 
  - CSV được copy vào image
  - SQLite database trong volume

### Frontend Service
- **Port**: 80
- **Container**: `udemy-predictor-frontend`
- **Technologies**:
  - React + TypeScript
  - Vite
  - Tailwind CSS
  - Nginx (production server)

## Development Mode

Nếu bạn muốn chạy với hot reload (code thay đổi tự động reload):

### Development Docker Compose

```bash
# Tạo file docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up --build
```

File `docker-compose.dev.yml` đã được tạo sẵn với:
- Volume mounts cho code
- Hot reload enabled
- Logs output trực tiếp

## Production Mode

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Các lệnh hữu ích

### Xem logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs backend only
docker-compose logs -f backend

# Xem logs frontend only
docker-compose logs -f frontend
```

### Kiểm tra status

```bash
# Xem status services
docker-compose ps

# Xem resource usage
docker stats
```

### Rebuild specific service

```bash
# Rebuild backend only
docker-compose up -d --build backend

# Rebuild frontend only
docker-compose up -d --build frontend
```

### Access container shell

```bash
# Vào backend container
docker exec -it udemy-predictor-backend bash

# Vào frontend container
docker exec -it udemy-predictor-frontend sh

# Test backend trong container
docker exec -it udemy-predictor-backend python test_sequential_mining.py
```

## Test API trong Docker

### Từ host machine:

```bash
# Health check
curl http://localhost:8000/

# Get topics
curl http://localhost:8000/topics/

# Get recommendation
curl -X POST http://localhost:8000/recommend/ \
  -H "Content-Type: application/json" \
  -d '{"target_topic": "Machine Learning", "courses_per_step": 3}'
```

### Từ trong container:

```bash
# Vào container
docker exec -it udemy-predictor-backend bash

# Chạy test script
python test_sequential_mining.py

# Test API internal
curl http://localhost:8000/topics/
```

## Troubleshooting

### Port đã được sử dụng

**Lỗi**: `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Giải pháp**: Thay đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Thay đổi 8000 -> 8001
```

### Backend không start

**Kiểm tra logs**:
```bash
docker-compose logs backend
```

**Thường gặp**:
- Missing dependencies: Rebuild image
- CSV file not found: Check if `data_final_fix.csv` exists
- Port conflict: Change port mapping

### Frontend không connect được backend

**Kiểm tra**:
1. Backend có đang chạy không: `curl http://localhost:8000/`
2. CORS settings trong backend
3. API URL trong frontend build

**Fix**: Rebuild với đúng API URL:
```bash
docker-compose down
docker-compose up --build
```

### Slow build time

**Tối ưu**:
```bash
# Use BuildKit
DOCKER_BUILDKIT=1 docker-compose build

# Build parallel
docker-compose build --parallel
```

### Out of disk space

**Cleanup**:
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a
```

## Networking

Services communicate qua `app-network`:
- Backend: `http://backend:8000`
- Frontend: `http://frontend:80`

**Từ host**: Dùng `localhost`
**Giữa containers**: Dùng service name

## Volumes

### backend-data
- Path trong container: `/app/data`
- Lưu trữ: SQLite database
- Persist: Không bị mất khi restart

**Backup database**:
```bash
docker cp udemy-predictor-backend:/app/data/udemy_predictions.db ./backup.db
```

**Restore database**:
```bash
docker cp ./backup.db udemy-predictor-backend:/app/data/udemy_predictions.db
```

## Environment Variables

### Backend:
- `DATABASE_URL`: SQLite database path
- `CORS_ORIGINS`: Allowed origins

### Frontend:
- `VITE_API_URL`: Backend API URL

**Override trong docker-compose**:
```yaml
environment:
  - VITE_API_URL=http://myserver:8000
```

## Performance

### Resource Limits

Thêm vào `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Optimization Tips

1. **Multi-stage builds**: Frontend đã dùng
2. **Layer caching**: Copy requirements.txt trước
3. **Slim images**: Dùng `python:3.9-slim`, `node:20-alpine`
4. **Health checks**: Đã config sẵn

## CI/CD Integration

### GitHub Actions Example:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build images
        run: docker-compose build
      
      - name: Run tests
        run: |
          docker-compose up -d
          docker exec udemy-predictor-backend python test_sequential_mining.py
```

## Security

### Best Practices:

1. **Không commit sensitive data**:
   - Database passwords
   - API keys
   - Secrets

2. **Sử dụng .env file**:
```bash
# .env
DATABASE_PASSWORD=your_secure_password
SECRET_KEY=your_secret_key
```

3. **Update images thường xuyên**:
```bash
docker-compose pull
docker-compose up -d
```

## Monitoring

### Health Checks:

Đã được config trong docker-compose:
- Backend: Check HTTP endpoint
- Frontend: Check Nginx response

**Xem health status**:
```bash
docker-compose ps
```

### Resource Monitoring:

```bash
# Real-time stats
docker stats

# Specific container
docker stats udemy-predictor-backend
```

## Production Deployment

### VPS/Cloud Server:

1. **Install Docker & Docker Compose**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Clone repository**:
```bash
git clone your-repo
cd Data_Mining_WebDemo
```

3. **Update environment**:
```bash
# Edit docker-compose.prod.yml
nano docker-compose.prod.yml
```

4. **Deploy**:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

5. **Setup reverse proxy** (optional):
```bash
# Nginx reverse proxy for SSL
sudo apt install nginx certbot
```

## Backup & Restore

### Full Backup:

```bash
# Backup database
docker cp udemy-predictor-backend:/app/data ./backup/data

# Export images
docker save udemy-predictor-backend:latest > backend.tar
docker save udemy-predictor-frontend:latest > frontend.tar
```

### Full Restore:

```bash
# Restore database
docker cp ./backup/data udemy-predictor-backend:/app/

# Load images
docker load < backend.tar
docker load < frontend.tar
```

## FAQ

**Q: Có cần copy file CSV vào container không?**
A: Không, Dockerfile đã `COPY . .` nên CSV tự động được copy.

**Q: Làm sao update code khi đang chạy?**
A: 
```bash
git pull
docker-compose up -d --build
```

**Q: Backend chậm khi start lần đầu?**
A: Bình thường, đang load 10K courses vào memory. Chờ ~10-30s.

**Q: Có thể scale services không?**
A: Có, với docker-compose scale:
```bash
docker-compose up -d --scale backend=3
```

**Q: Database bị mất khi restart?**
A: Không, data được lưu trong volume. Chỉ mất khi `docker-compose down -v`.

## Tóm tắt Commands

```bash
# Start
docker-compose up -d --build

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build

# Clean
docker-compose down -v
docker system prune -a
```

## Support

- Backend issues: Check `docker-compose logs backend`
- Frontend issues: Check `docker-compose logs frontend`
- Network issues: Check `docker network ls`
- Volume issues: Check `docker volume ls`

---

**Ready to go!** 🚀

Chỉ cần chạy:
```bash
docker-compose up -d --build
```

Và truy cập http://localhost để sử dụng!

