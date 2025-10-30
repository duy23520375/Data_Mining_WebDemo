from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
from datetime import datetime

class UdemyPrediction(Base):
    __tablename__ = "udemy_predictions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Input features - 11 features sau feature engineering
    rating = Column(Float)
    discount = Column(Float)
    log_num_reviews = Column(Float)
    log_num_students = Column(Float)
    log_price = Column(Float)
    log_total_length_minutes = Column(Float)
    sqrt_sections = Column(Float)
    effective_price = Column(Float)
    popularity_score = Column(Float)
    price_per_hour = Column(Float)
    discount_category = Column(Integer)
    
    # Prediction output - Classification (Bestseller hoặc Not Bestseller)
    prediction = Column(String)
    probability = Column(Float)  # Xác suất dự đoán
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)

