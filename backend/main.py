import os
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal, engine
import models
from schemas import UdemyPredictionResponse
from ml_model import PredictionInput, model as ml_model
from sequential_mining import get_recommender

# ===================== App & DB =====================

app = FastAPI(
    title="Udemy Price Prediction API",
    description="API dự đoán & gợi ý khóa học (Udemy)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Tạo bảng nếu chưa có
models.Base.metadata.create_all(bind=engine)

# ===================== CORS =====================

# Cho phép cấu hình domain FE qua ENV:
# FRONTEND_ORIGINS="https://your-vercel-app.vercel.app,https://your-custom-domain.com"
_env_origins = os.getenv("FRONTEND_ORIGINS", "")
configured_origins = [o.strip() for o in _env_origins.split(",") if o.strip()]

default_local_origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
]

allow_origins = configured_origins or default_local_origins

# Nếu muốn mở hoàn toàn (demo), set FRONTEND_ORIGINS="*"
if allow_origins == ["*"]:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,  # '*' không đi cùng allow_credentials=True
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# ===================== Dependency =====================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===================== API Router (/api) =====================

api = APIRouter(prefix="/api")

@api.get("/health/")
async def health():
    return {"ok": True, "version": "1.0.0"}

@api.get("/")
async def api_root():
    """Ping nhanh /api để FE health-check."""
    return {
        "message": "Udemy Price Prediction API is running",
        "version": "1.0.0",
        "status": "active",
    }

@api.post("/predict/", response_model=UdemyPredictionResponse)
async def predict(input_data: PredictionInput, db: Session = Depends(get_db)):
    """
    Dự đoán khoá học có phải Bestseller hay không.
    FE: POST /api/predict/
    """
    try:
        # ml_model.predict phải trả dict {'prediction': str, 'probability': float}
        result = ml_model.predict(input_data)

        # Lưu DB (các field RAW của input + prediction/probability)
        db_record = models.UdemyPrediction(
            **input_data.dict(),
            prediction=result["prediction"],
            probability=result["probability"],
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi dự đoán: {str(e)}")

@api.get("/predictions/", response_model=List[UdemyPredictionResponse])
async def get_predictions(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """
    Danh sách dự đoán (mới nhất trước).
    FE: GET /api/predictions/?skip=0&limit=100
    """
    items = (
        db.query(models.UdemyPrediction)
        .order_by(models.UdemyPrediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items

@api.get("/predictions/{prediction_id}/", response_model=UdemyPredictionResponse)
async def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """
    FE: GET /api/predictions/{id}/
    """
    item = (
        db.query(models.UdemyPrediction)
        .filter(models.UdemyPrediction.id == prediction_id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự đoán")
    return item

@api.delete("/predictions/{prediction_id}/")
async def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """
    FE: DELETE /api/predictions/{id}/
    """
    item = (
        db.query(models.UdemyPrediction)
        .filter(models.UdemyPrediction.id == prediction_id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự đoán")
    db.delete(item)
    db.commit()
    return {"message": "Đã xóa dự đoán thành công", "id": prediction_id}

@api.delete("/predictions/")
async def delete_all_predictions(db: Session = Depends(get_db)):
    """
    FE: DELETE /api/predictions/
    """
    count = db.query(models.UdemyPrediction).delete()
    db.commit()
    return {"message": f"Đã xóa {count} dự đoán"}

@api.get("/stats/")
async def get_stats(db: Session = Depends(get_db)):
    """
    FE: GET /api/stats/
    """
    total_predictions = db.query(models.UdemyPrediction).count()
    return {"total_predictions": total_predictions, "message": "Thống kê hệ thống"}

# ===================== Recommendation =====================

class RecommendationRequest(BaseModel):
    target_topic: str
    max_steps: Optional[int] = None
    courses_per_step: int = 3

@api.post("/recommend/")
async def get_recommendations(request: RecommendationRequest):
    """
    FE: POST /api/recommend/
    """
    try:
        recommender = get_recommender()
        result = recommender.get_full_recommendation(
            target_topic=request.target_topic,
            max_steps=request.max_steps,
            courses_per_step=request.courses_per_step,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo recommendation: {str(e)}")

@api.get("/topics/")
async def get_available_topics():
    """
    FE: GET /api/topics/
    """
    try:
        recommender = get_recommender()
        topics = recommender.get_available_topics()
        return {"topics": topics, "count": len(topics)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy topics: {str(e)}")

@api.get("/search/")
async def search_courses(keyword: str, limit: int = 10):
    """
    FE: GET /api/search/?keyword=...&limit=10
    """
    try:
        recommender = get_recommender()
        courses = recommender.search_courses_by_keyword(keyword, limit)
        return {"courses": courses, "count": len(courses), "keyword": keyword}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tìm kiếm: {str(e)}")

# Gắn router vào app
app.include_router(api)

# Root "/" cho người dùng/monitor
@app.get("/")
async def root():
    return {
        "message": "Udemy Price Prediction API (xem tài liệu tại /docs, health tại /api/health/)",
        "docs": "/docs",
        "health": "/api/health/",
    }
