# 🚀 Deployment Guide

Hướng dẫn deploy Udemy Bestseller Predictor lên production.

## 📋 Yêu cầu

- Server với Docker và Docker Compose
- Domain name (optional, cho HTTPS)
- 2GB RAM minimum
- 10GB disk space

## 🐳 Deploy với Docker Compose

### 1. Chuẩn bị Server

```bash
# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### 2. Clone Code

```bash
git clone <your-repo-url>
cd WEB/Data_Mining_WebDemo
```

### 3. Cấu hình Environment

Tạo file `.env`:

```bash
# Backend
DATABASE_URL=sqlite:///./data/udemy_predictions.db
CORS_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### 4. Deploy

**Development Mode:**
```bash
docker-compose up -d
```

**Production Mode:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Kiểm tra

```bash
# Xem logs
docker-compose logs -f

# Kiểm tra containers
docker ps

# Test API
curl http://localhost:8000/
```

## 🌐 Cấu hình Domain & HTTPS

### Với Nginx Reverse Proxy

1. **Tạo file nginx config:**

```nginx
# /etc/nginx/sites-available/udemy-predictor

server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

2. **Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/udemy-predictor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Setup SSL với Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🔒 Security Best Practices

### 1. Environment Variables

- Không commit file `.env` lên Git
- Sử dụng Docker secrets cho sensitive data
- Rotate credentials định kỳ

### 2. Firewall

```bash
# Chỉ mở port 80, 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### 3. Docker Security

```bash
# Run containers as non-root user
# Giới hạn resources trong docker-compose.yml:

services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
```

### 4. Database Backup

```bash
# Backup script
docker exec udemy-predictor-backend-prod \
  sqlite3 /app/data/udemy_predictions.db .dump > backup_$(date +%Y%m%d).sql

# Cron job backup hàng ngày
0 2 * * * /path/to/backup-script.sh
```

## 📊 Monitoring

### 1. Docker Stats

```bash
docker stats
```

### 2. Logs

```bash
# Real-time logs
docker-compose logs -f

# Logs của service cụ thể
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

### 3. Health Checks

```bash
# Check container health
docker ps --filter health=healthy

# Manual health check
curl http://localhost:8000/
curl http://localhost/
```

## 🔄 Update & Maintenance

### 1. Update Code

```bash
# Pull latest code
git pull origin main

# Rebuild và restart
docker-compose build
docker-compose up -d
```

### 2. Database Migration

```bash
# Backup trước khi migrate
docker exec udemy-predictor-backend-prod \
  sqlite3 /app/data/udemy_predictions.db .dump > backup.sql

# Chạy migration (nếu có)
docker-compose exec backend python migrate.py
```

### 3. Rollback

```bash
# Rollback code
git checkout <previous-commit>

# Rebuild
docker-compose build
docker-compose up -d

# Restore database
docker exec -i udemy-predictor-backend-prod \
  sqlite3 /app/data/udemy_predictions.db < backup.sql
```

## 🐛 Troubleshooting

### Container không start

```bash
# Xem logs
docker-compose logs backend

# Restart service
docker-compose restart backend
```

### Out of Memory

```bash
# Tăng memory limit trong docker-compose.yml
services:
  backend:
    mem_limit: 2g
```

### Database corruption

```bash
# Restore từ backup
docker exec -i udemy-predictor-backend-prod \
  sqlite3 /app/data/udemy_predictions.db < backup.sql
```

## 📈 Performance Tuning

### 1. Frontend

- Enable Gzip compression (trong nginx.conf)
- Cache static assets
- CDN cho static files

### 2. Backend

- Increase uvicorn workers
- Add Redis cache
- Database indexing

### 3. Docker

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
```

## 🌍 Multi-Region Deployment

Sử dụng Docker Swarm hoặc Kubernetes để deploy nhiều regions.

### Docker Swarm

```bash
# Init swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml udemy-predictor

# Scale service
docker service scale udemy-predictor_backend=3
```

## 💰 Cost Optimization

### Cloud Providers

**VPS Options:**
- DigitalOcean Droplet: $12/month (2GB RAM)
- AWS Lightsail: $10/month (2GB RAM)
- Linode: $12/month (2GB RAM)

**Container Services:**
- AWS ECS Fargate
- Google Cloud Run
- Azure Container Instances

### Recommendations

- Development: 2GB RAM VPS
- Production: 4GB RAM VPS + Load Balancer
- High Traffic: Kubernetes cluster

## 📞 Support

Nếu gặp vấn đề, check:
1. Docker logs: `docker-compose logs -f`
2. Container status: `docker ps -a`
3. Disk space: `df -h`
4. Memory: `free -m`

