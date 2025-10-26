# Backend - FastAPI + XGBoost

API backend cho Udemy Bestseller Predictor.

## 🚀 Quick Start với Docker

```bash
# Từ thư mục root
docker-compose up -d backend
```

## 📁 Cấu trúc

- `main.py` - API endpoints và CORS config
- `ml_model.py` - XGBoost model loading và prediction
- `models.py` - SQLAlchemy database models
- `schemas.py` - Pydantic request/response schemas
- `database.py` - Database configuration
- `model.pkl` - Trained XGBoost model (736KB)
- `requirements.txt` - Python dependencies

## 🔧 Development

```bash
# Tạo virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📊 API Endpoints

- `GET /` - Health check
- `POST /predict/` - Dự đoán bestseller
- `GET /predictions/` - Lấy danh sách predictions
- `GET /predictions/{id}` - Lấy một prediction
- `DELETE /predictions/{id}` - Xóa một prediction
- `DELETE /predictions/` - Xóa tất cả
- `GET /stats/` - Thống kê

## 🧪 Testing

```bash
# Test với curl
curl http://localhost:8000/

# Test prediction
curl -X POST http://localhost:8000/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4.5,
    "num_students": 10000,
    "price": 369000,
    ...
  }'
```

## 📦 Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- SQLAlchemy - ORM
- Pydantic - Data validation
- XGBoost - ML model
- scikit-learn - ML utilities
- pandas, numpy - Data processing
