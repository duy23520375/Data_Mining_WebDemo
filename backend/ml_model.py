import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field
from typing import Optional
import os

# Định nghĩa input từ người dùng - 18 features sau feature engineering
class PredictionInput(BaseModel):
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

class PredictionOutput(BaseModel):
    prediction: str
    probability: float

class UdemyBestsellerModel:
    def __init__(self):
        model_path = 'model.pkl'
        
        # Load model (XGBClassifier)
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print(f"✓ Đã load model từ {model_path}")
            print(f"  Model type: {type(self.model).__name__}")
            if hasattr(self.model, 'n_features_in_'):
                print(f"  Number of features: {self.model.n_features_in_}")
        else:
            print(f"⚠ Warning: {model_path} không tồn tại.")
            self.model = None
        
        # Mapping cho classification
        self.target_mapping = {
            0: 'Not Bestseller',
            1: 'Bestseller'
        }

    def preprocess_input(self, input_data: PredictionInput):
        """
        Tiền xử lý dữ liệu đầu vào theo đúng thứ tự 18 features
        """
        # Thứ tự features phải giống với lúc train model
        ordered_columns = [
            'rating', 'num_students', 'price', 'discount', 
            'lectures', 'total_length_minutes', 'log_num_reviews', 
            'log_num_students', 'price_capped', 'log_price', 
            'log_total_length_minutes', 'sqrt_sections', 'sqrt_lectures', 
            'effective_price', 'popularity_score', 'rating_x_students', 
            'price_per_hour', 'discount_category'
        ]
        
        data_dict = input_data.dict()
        
        # Tạo DataFrame với đúng thứ tự cột
        X = pd.DataFrame([[data_dict[col] for col in ordered_columns]], 
                        columns=ordered_columns)
        
        print("Input features:", X.columns.tolist())
        print("Input values:", X.values.tolist()[0])
        
        return X

    def predict(self, input_data: PredictionInput):
        """
        Dự đoán bestseller
        Returns: {"prediction": str, "probability": float}
        """
        X_processed = self.preprocess_input(input_data)
        
        if self.model is not None:
            # Dự đoán class (0 hoặc 1)
            prediction_class = self.model.predict(X_processed)[0]
            prediction_label = self.target_mapping[prediction_class]
            
            # Lấy probability
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(X_processed)[0]
                probability = float(probabilities[prediction_class])
            else:
                probability = 1.0
            
            print(f"Prediction: {prediction_label} (probability: {probability:.4f})")
            
            return {
                "prediction": prediction_label,
                "probability": probability
            }
        else:
            # Dummy prediction nếu chưa có model
            return {
                "prediction": "Not Bestseller",
                "probability": 0.5
            }


# Khởi tạo mô hình để dùng trong FastAPI
model = UdemyBestsellerModel()

