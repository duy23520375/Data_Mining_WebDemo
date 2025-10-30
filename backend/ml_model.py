import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field
from typing import Optional
import os

# ============== INPUT/OUTPUT SCHEMAS ==============

class PredictionInput(BaseModel):
    """
    Input: 11 features đã được feature engineering từ frontend
    Backend chỉ cần scale và predict
    """
    rating: float = Field(description="Đánh giá khóa học (0.0 - 5.0)")
    discount: float = Field(description="Mức giảm giá (0.0 - 1.0)")
    log_num_reviews: float = Field(description="Log của số lượng đánh giá")
    log_num_students: float = Field(description="Log của số lượng học viên")
    log_price: float = Field(description="Log của giá")
    log_total_length_minutes: float = Field(description="Log của tổng thời lượng")
    sqrt_sections: float = Field(description="Căn bậc 2 của số sections")
    effective_price: float = Field(description="Giá hiệu quả sau giảm giá")
    popularity_score: float = Field(description="Điểm độ phổ biến")
    price_per_hour: float = Field(description="Giá mỗi giờ")
    discount_category: int = Field(description="Danh mục giảm giá (0-2)")

class PredictionOutput(BaseModel):
    prediction: str
    probability: float

# ============== MODEL CLASS ==============

class UdemyBestsellerModel:
    """
    Model dự đoán Udemy Bestseller
    Nhận 11 features đã engineered từ frontend, scale và predict
    """
    
    def __init__(self):
        # Paths
        model_path = 'model.pkl'
        scaler_path = 'scaler_final.pkl'
        
        # Load model (Random Forest sau GridSearch)
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print(f"✓ Đã load model từ {model_path}")
            print(f"  Model type: {type(self.model).__name__}")
            if hasattr(self.model, 'n_features_in_'):
                print(f"  Number of features: {self.model.n_features_in_}")
        else:
            print(f"⚠ Warning: {model_path} không tồn tại.")
            self.model = None
        
        # Load scaler (RobustScaler đã fit trên train set)
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)
            print(f"✓ Đã load scaler từ {scaler_path}")
        else:
            print(f"⚠ Warning: {scaler_path} không tồn tại.")
            self.scaler = None
        
        # Thứ tự features (11 features) - PHẢI ĐÚNG với lúc train
        self.FEATURE_NAMES = [
            'rating', 'discount', 'log_num_reviews', 
            'log_num_students', 'log_price', 'log_total_length_minutes', 
            'sqrt_sections', 'effective_price', 'popularity_score', 
            'price_per_hour', 'discount_category'
        ]
        
        # Mapping cho classification
        self.target_mapping = {
            0: 'Not Bestseller',
            1: 'Bestseller'
        }
    
    def preprocess_input(self, input_data: PredictionInput) -> pd.DataFrame:
        """
        Tiền xử lý input: chỉ cần scale vì frontend đã feature engineering
        
        Args:
            input_data: PredictionInput với 11 features đã engineered
            
        Returns:
            DataFrame đã được scale với 11 features
        """
        # Chuyển input thành dict và DataFrame
        data_dict = input_data.dict()
        
        # Tạo DataFrame với đúng thứ tự cột
        X = pd.DataFrame([[data_dict[col] for col in self.FEATURE_NAMES]], 
                        columns=self.FEATURE_NAMES)
        
        # Scale với RobustScaler
        if self.scaler is not None:
            X_scaled = self.scaler.transform(X)
            df_scaled = pd.DataFrame(X_scaled, columns=self.FEATURE_NAMES)
            return df_scaled
        else:
            print("⚠ Warning: Scaler không tồn tại, trả về data chưa scale")
            return X
    
    def predict(self, input_data: PredictionInput) -> dict:
        """
        Dự đoán bestseller từ 11 features đã engineered
        
        Args:
            input_data: PredictionInput với 11 features
            
        Returns:
            {
                "prediction": "Bestseller" hoặc "Not Bestseller",
                "probability": float (0-1)
            }
        """
        # Preprocess (chỉ scaling)
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
            
            print(f"✓ Prediction: {prediction_label} (prob: {probability:.4f})")
            
            return {
                "prediction": prediction_label,
                "probability": probability
            }
        else:
            # Dummy prediction nếu chưa có model
            print("⚠ Warning: Model không tồn tại, trả về dummy prediction")
            return {
                "prediction": "Not Bestseller",
                "probability": 0.5
            }


# ============== KHỞI TẠO MODEL (Singleton) ==============

# Khởi tạo model một lần khi module được import
model = UdemyBestsellerModel()

# Export để dùng trong FastAPI
__all__ = ['model', 'PredictionInput', 'PredictionOutput']
