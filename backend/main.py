from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from schemas import UdemyPredictionBase, UdemyPredictionResponse
from ml_model import PredictionInput, model as ml_model
from typing import List

app = FastAPI(
    title="Udemy Price Prediction API",
    description="API dự đoán giá khóa học Udemy",
    version="1.0.0"
)

# Tạo bảng nếu chưa có
models.Base.metadata.create_all(bind=engine)

# Cấu hình CORS - cho phép kết nối từ React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default port
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency để lấy database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    """
    Endpoint kiểm tra API đang hoạt động
    """
    return {
        "message": "Udemy Price Prediction API is running",
        "version": "1.0.0",
        "status": "active"
    }

@app.post("/predict/", response_model=UdemyPredictionResponse)
async def predict(input_data: PredictionInput, db: Session = Depends(get_db)):
    """
    Endpoint dự đoán khóa học Udemy có phải Bestseller không
    
    Input: 18 features sau feature engineering
    Output: Bestseller hoặc Not Bestseller với xác suất
    """
    try:
        # Gọi model để dự đoán
        result = ml_model.predict(input_data)
        
        # Lưu vào database
        db_record = models.UdemyPrediction(
            **input_data.dict(),
            prediction=result["prediction"],
            probability=result["probability"]
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return db_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi dự đoán: {str(e)}")

@app.get("/predictions/", response_model=List[UdemyPredictionResponse])
async def get_predictions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lấy danh sách các dự đoán đã thực hiện
    
    - **skip**: Số lượng bản ghi bỏ qua (pagination)
    - **limit**: Số lượng bản ghi tối đa trả về
    """
    predictions = db.query(models.UdemyPrediction)\
        .order_by(models.UdemyPrediction.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return predictions

@app.get("/predictions/{prediction_id}", response_model=UdemyPredictionResponse)
async def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin một dự đoán cụ thể theo ID
    """
    prediction = db.query(models.UdemyPrediction)\
        .filter(models.UdemyPrediction.id == prediction_id)\
        .first()
    
    if prediction is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự đoán")
    
    return prediction

@app.delete("/predictions/{prediction_id}")
async def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """
    Xóa một dự đoán theo ID
    """
    prediction = db.query(models.UdemyPrediction)\
        .filter(models.UdemyPrediction.id == prediction_id)\
        .first()
    
    if prediction is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự đoán")
    
    db.delete(prediction)
    db.commit()
    
    return {"message": "Đã xóa dự đoán thành công", "id": prediction_id}

@app.delete("/predictions/")
async def delete_all_predictions(db: Session = Depends(get_db)):
    """
    Xóa tất cả các dự đoán (cẩn thận khi sử dụng!)
    """
    count = db.query(models.UdemyPrediction).delete()
    db.commit()
    
    return {"message": f"Đã xóa {count} dự đoán"}

@app.get("/stats/")
async def get_stats(db: Session = Depends(get_db)):
    """
    Lấy thống kê tổng quan
    """
    total_predictions = db.query(models.UdemyPrediction).count()
    
    return {
        "total_predictions": total_predictions,
        "message": "Thống kê hệ thống"
    }

