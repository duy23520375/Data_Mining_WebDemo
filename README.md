# 🎓 Udemy Course Bestseller Predictor

Ứng dụng dự đoán khả năng thành công của khóa học Udemy sử dụng Machine Learning (XGBoost) và FastAPI + React.

## 🚀 Tính năng

- ✅ **Dự đoán Bestseller**: Dự đoán khả năng khóa học trở thành bestseller
- 🎓 **Sequential Mining Recommendations**: Gợi ý learning path thông minh dựa trên Graph-based Sequential Mining
- 📊 **Phân tích**: Xem lịch sử dự đoán và thống kê
- 🎯 **Real-time**: API nhanh với FastAPI
- 💎 **UI hiện đại**: React + TypeScript + Tailwind CSS + shadcn/ui
- 🐳 **Docker Ready**: Deploy dễ dàng với Docker Compose
- 🔍 **10,181 Courses**: Database thực từ Udemy với đầy đủ metadata

## 📋 Yêu cầu hệ thống

- Docker Desktop (Windows/Mac) hoặc Docker Engine + Docker Compose (Linux)
- 2GB RAM trở lên
- Port 80 (frontend) và 8000 (backend) available

## 🏁 Quick Start với Docker (Khuyến nghị)

> ⚡ **Cách dễ nhất**: Chỉ cần Docker, không cần cài Python/Node.js!

### Chạy Script Tự Động

**Windows:**
```cmd
START_DOCKER.bat
```

**Linux/Mac:**
```bash
chmod +x START_DOCKER.sh
./START_DOCKER.sh
```

### Hoặc dùng Docker Compose trực tiếp

## 🏁 Quick Start với Docker

### 1. Clone repository

```bash
git clone <your-repo-url>
cd WEB/Data_Mining_WebDemo
```

### 2. Khởi động ứng dụng

**Windows:**
```bash
docker-compose up -d
```

**Linux/Mac:**
```bash
docker-compose up -d
```

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Dừng ứng dụng

```bash
docker-compose down
```

## 🔧 Cấu trúc dự án

```
Data_Mining_WebDemo/
├── backend/                      # FastAPI Backend
│   ├── main.py                  # API endpoints
│   ├── ml_model.py              # XGBoost model
│   ├── sequential_mining.py     # 🆕 Sequential Mining module
│   ├── models.py                # Database models
│   ├── schemas.py               # Pydantic schemas
│   ├── database.py              # SQLAlchemy config
│   ├── model.pkl                # Trained ML model
│   ├── data_final_fix.csv       # 🆕 10K+ Udemy courses
│   ├── requirements.txt         # Python dependencies
│   ├── test_sequential_mining.py # 🆕 Test script
│   ├── test_api.ps1/sh          # 🆕 API test scripts
│   ├── Dockerfile               # Backend container
│   └── SEQUENTIAL_MINING_README.md # 🆕 Backend docs
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── pages/              # React pages
│   │   │   ├── Predict.tsx            # Prediction form
│   │   │   ├── Analytics.tsx          # Analytics dashboard
│   │   │   ├── Recommend.tsx          # 🆕 Sequential Mining UI
│   │   │   └── About.tsx              # About page
│   │   ├── components/         # UI components (shadcn/ui)
│   │   ├── services/           # API service
│   │   │   └── api.ts                 # 🆕 Updated với recommendation methods
│   │   └── lib/
│   │       └── featureEngineering.ts  # Feature transformation
│   ├── package.json
│   ├── Dockerfile              # Production container
│   ├── Dockerfile.dev          # 🆕 Development container
│   ├── nginx.conf              # Nginx config
│   └── .dockerignore
│
├── docker-compose.yml           # Production orchestration
├── docker-compose.dev.yml       # 🆕 Development orchestration
├── START_DOCKER.bat/.sh         # 🆕 Easy start scripts
├── DOCKER_GUIDE.md              # 🆕 Docker documentation
├── QUICK_START_DOCKER.md        # 🆕 Quick start guide
├── SEQUENTIAL_MINING_GUIDE.md   # 🆕 Sequential Mining docs
├── graph_based_sequential_mining.ipynb    # Research notebook
└── sequential_mining_algorithm.ipynb      # Research notebook
```

## 🎯 Cách sử dụng

### 1. Predict Page

1. Nhập thông tin khóa học (8 trường):
   - **Price**: Giá khóa học (VND)
   - **Rating**: Đánh giá (0-5)
   - **Students**: Số học viên
   - **Reviews**: Số đánh giá
   - **Duration**: Thời lượng (phút)
   - **Discount**: Giảm giá (%)
   - **Lectures**: Số bài giảng
   - **Sections**: Số chương

2. Click "Predict Success"

3. Xem kết quả:
   - Prediction: Bestseller / Not Bestseller
   - Probability: Độ tin cậy (%)
   - Confidence Level: High/Medium/Low

### 2. Analytics Page

- Xem tất cả dự đoán đã thực hiện
- Thống kê tổng quan
- Quản lý lịch sử

### 3. Recommendations Page (Sequential Mining) 🆕

1. Nhập topic/skill bạn muốn học (ví dụ: "Machine Learning", "React JS")
2. Click "Tìm Learning Path"
3. Nhận được:
   - **Complete Learning Path**: Thứ tự logic từ cơ bản đến nâng cao
   - **Top Courses**: 3 khóa học tốt nhất cho mỗi bước
   - **Smart Ranking**: Ưu tiên Bestseller, Rating cao, Học viên nhiều

**Ví dụ**: Input "Machine Learning" → Output:
```
Python → SQL → Numpy → Pandas → Data Science → Machine Learning
```
Với top 3 courses cho mỗi bước!

## 🎓 Sequential Mining System

### Knowledge Graph
- **25+ Topics**: ML, AI, Web Dev, Programming, DevOps...
- **Directed Graph**: Prerequisites relationships (A → B → C)
- **Algorithms**: NetworkX topological sort

### Path Finding
1. Input: Target topic (e.g., "Machine Learning")
2. Find all prerequisites using `nx.ancestors()`
3. Create curriculum graph
4. Topological sort for logical order
5. Map courses to each step
6. Rank: Bestseller > Rating > Students

### Data Source
- **10,181 courses** từ Udemy
- Real metadata: title, rating, students, price, topics...
- Parsed `related_topics` để map vào graph

**Xem chi tiết**: [SEQUENTIAL_MINING_GUIDE.md](SEQUENTIAL_MINING_GUIDE.md)

## 🔬 Machine Learning Pipeline

### Input (8 features từ user):
1. price
2. rating
3. num_students
4. num_reviews
5. duration
6. discount
7. lectures
8. sections

### Feature Engineering (Tự động):

Frontend (`featureEngineering.ts`) tự động tính toán **18 features**:

**Log Transformations:**
- log_num_reviews
- log_num_students
- log_price
- log_total_length_minutes

**Square Root Transformations:**
- sqrt_sections
- sqrt_lectures

**Derived Features:**
- price_capped (giới hạn giá tối đa)
- effective_price (giá sau giảm)
- popularity_score (rating × students / 2)
- rating_x_students (rating × students)
- price_per_hour (price / hours)
- discount_category (phân loại 0-2)

### Model:
- **Algorithm**: XGBoost Classifier
- **Output**: Bestseller probability (0-1)

## 📡 API Endpoints

### GET `/`
Health check

### POST `/predict/`
Dự đoán bestseller

**Request Body:**
```json
{
  "rating": 4.5,
  "num_students": 10000,
  "price": 369000,
  "discount": 0.81,
  "lectures": 386,
  "total_length_minutes": 2564,
  "log_num_reviews": 12.2,
  "log_num_students": 9.2,
  "price_capped": 369000,
  "log_price": 12.8,
  "log_total_length_minutes": 7.8,
  "sqrt_sections": 6.78,
  "sqrt_lectures": 19.6,
  "effective_price": 70110,
  "popularity_score": 22500,
  "rating_x_students": 45000,
  "price_per_hour": 8633,
  "discount_category": 2
}
```

**Response:**
```json
{
  "id": 1,
  "prediction": "Bestseller",
  "probability": 0.87,
  "created_at": "2024-01-01T00:00:00",
  ...
}
```

### GET `/predictions/`
Lấy danh sách predictions

### GET `/predictions/{id}`
Lấy một prediction cụ thể

### DELETE `/predictions/{id}`
Xóa một prediction

### DELETE `/predictions/`
Xóa tất cả predictions

### GET `/stats/`
Thống kê

## 🛠️ Development Mode

### Backend (với virtual environment)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (với Vite dev server)

```bash
cd frontend
npm install
npm run dev
```

## 🐳 Docker Commands

### Build lại images

```bash
docker-compose build
```

### Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

### Restart services

```bash
docker-compose restart
```

### Xóa containers và volumes

```bash
docker-compose down -v
```

## 📊 Database

- **Type**: SQLite
- **Location**: `backend/data/udemy_predictions.db` (trong Docker volume)
- **Tables**: 
  - `udemy_predictions`: Lưu trữ tất cả predictions

## 🔒 Production Deployment

### 1. Environment Variables

Tạo file `.env`:

```env
# Backend
DATABASE_URL=sqlite:///./data/udemy_predictions.db
CORS_ORIGINS=https://your-domain.com

# Frontend
VITE_API_URL=https://api.your-domain.com
```

### 2. Build cho production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Reverse Proxy (Nginx/Traefik)

Cấu hình domain và SSL certificate cho production.

## 🧪 Testing

### Backend API Test

```bash
curl http://localhost:8000/
```

### Frontend Test

Mở browser: http://localhost

## 🐛 Troubleshooting

### Port đã được sử dụng

```bash
# Kiểm tra port
netstat -ano | findstr :8000
netstat -ano | findstr :80

# Đổi port trong docker-compose.yml
ports:
  - "8001:8000"  # Backend
  - "8080:80"    # Frontend
```

### Database bị lỗi

```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

### Frontend không kết nối được API

Kiểm tra `VITE_API_URL` trong environment:
- Development: `http://localhost:8000`
- Production: URL thực tế của API

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

MIT License

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- XGBoost team
- FastAPI
- React + Vite
- shadcn/ui
- Tailwind CSS
