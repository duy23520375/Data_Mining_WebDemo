from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# ============== INPUT SCHEMA (11 features đã engineered) ==============

class UdemyPredictionBase(BaseModel):
    """
    Input: 11 features đã được feature engineering từ frontend
    """
    rating: float = Field(
        description="Đánh giá khóa học (0.0 - 5.0)",
        example=4.5
    )
    discount: float = Field(
        description="Mức giảm giá (0.0 - 1.0)",
        example=0.75
    )
    log_num_reviews: float = Field(
        description="Log của số lượng đánh giá",
        example=9.903
    )
    log_num_students: float = Field(
        description="Log của số lượng học viên",
        example=10.820
    )
    log_price: float = Field(
        description="Log của giá",
        example=12.607
    )
    log_total_length_minutes: float = Field(
        description="Log của tổng thời lượng (phút)",
        example=6.497
    )
    sqrt_sections: float = Field(
        description="Căn bậc 2 của số sections",
        example=4.472
    )
    effective_price: float = Field(
        description="Giá hiệu quả sau giảm giá",
        example=92250.0
    )
    popularity_score: float = Field(
        description="Điểm độ phổ biến",
        example=25000.0
    )
    price_per_hour: float = Field(
        description="Giá mỗi giờ",
        example=30000.0
    )
    discount_category: int = Field(
        description="Danh mục giảm giá (0=High, 1=Low, 2=Medium)",
        example=2
    )

# ============== RESPONSE SCHEMA ==============

class UdemyPredictionResponse(UdemyPredictionBase):
    """
    Response trả về sau khi dự đoán
    Bao gồm cả input + kết quả dự đoán
    """
    id: int
    prediction: str  # "Bestseller" hoặc "Not Bestseller"
    probability: float  # Xác suất dự đoán (0.0 - 1.0)
    created_at: datetime

    class Config:
        from_attributes = True  # Thay thế orm_mode trong Pydantic v2

# ============== STATISTICS SCHEMA ==============

class PredictionStats(BaseModel):
    """Schema cho thống kê tổng quan"""
    total_predictions: int
    message: str
