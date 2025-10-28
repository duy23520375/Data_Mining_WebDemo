from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class UdemyPredictionBase(BaseModel):
    """
    Input features sau feature engineering - 13 features
    """
    rating: float = Field(description="Đánh giá (0.0 - 5.0)")
    num_students: float = Field(description="Số lượng học viên")
    price: float = Field(description="Giá khóa học")
    discount: float = Field(description="Giảm giá (0.0 - 1.0)")
    lectures: int = Field(description="Số lượng bài giảng")
    total_length_minutes: int = Field(description="Tổng thời lượng (phút)")
    log_num_reviews: float = Field(description="Log của số lượng đánh giá")
    log_num_students: float = Field(description="Log của số lượng học viên")
    price_capped: float = Field(description="Giá đã capped")
    log_price: float = Field(description="Log của giá")
    log_total_length_minutes: float = Field(description="Log của tổng thời lượng")
    sqrt_sections: float = Field(description="Căn bậc 2 của số sections")
    sqrt_lectures: float = Field(description="Căn bậc 2 của số lectures")
    effective_price: float = Field(description="Giá hiệu quả")
    popularity_score: float = Field(description="Điểm độ phổ biến")
    rating_x_students: float = Field(description="Rating nhân với số học viên")
    price_per_hour: float = Field(description="Giá mỗi giờ")
    discount_category: int = Field(description="Danh mục giảm giá")

class UdemyPredictionResponse(UdemyPredictionBase):
    id: int
    prediction: str  # "Bestseller" hoặc "Not Bestseller"
    probability: float  # Xác suất dự đoán (0.0 - 1.0)
    created_at: datetime

    class Config:
        from_attributes = True  # Thay thế orm_mode trong Pydantic v2

