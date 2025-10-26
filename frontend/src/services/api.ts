// API Service để kết nối với FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PredictionInput {
  // 18 features sau feature engineering
  rating: number;
  num_students: number;
  price: number;
  discount: number;
  lectures: number;
  total_length_minutes: number;
  log_num_reviews: number;
  log_num_students: number;
  price_capped: number;
  log_price: number;
  log_total_length_minutes: number;
  sqrt_sections: number;
  sqrt_lectures: number;
  effective_price: number;
  popularity_score: number;
  rating_x_students: number;
  price_per_hour: number;
  discount_category: number;
}

export interface PredictionResponse {
  id: number;
  prediction: string; // "Bestseller" or "Not Bestseller"
  probability: number;
  created_at: string;
  // ... all input features
  rating: number;
  num_students: number;
  price: number;
  discount: number;
  lectures: number;
  total_length_minutes: number;
  log_num_reviews: number;
  log_num_students: number;
  price_capped: number;
  log_price: number;
  log_total_length_minutes: number;
  sqrt_sections: number;
  sqrt_lectures: number;
  effective_price: number;
  popularity_score: number;
  rating_x_students: number;
  price_per_hour: number;
  discount_category: number;
}

export interface Stats {
  total_predictions: number;
  message: string;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Health check
  async healthCheck(): Promise<{ message: string; version: string; status: string }> {
    const response = await fetch(`${this.baseURL}/`);
    if (!response.ok) {
      throw new Error('API is not responding');
    }
    return response.json();
  }

  // Dự đoán bestseller
  async predict(data: PredictionInput): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseURL}/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Prediction failed');
    }

    return response.json();
  }

  // Lấy danh sách predictions
  async getPredictions(skip: number = 0, limit: number = 100): Promise<PredictionResponse[]> {
    const response = await fetch(`${this.baseURL}/predictions/?skip=${skip}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }

    return response.json();
  }

  // Lấy một prediction cụ thể
  async getPrediction(id: number): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseURL}/predictions/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prediction');
    }

    return response.json();
  }

  // Xóa một prediction
  async deletePrediction(id: number): Promise<{ message: string; id: number }> {
    const response = await fetch(`${this.baseURL}/predictions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete prediction');
    }

    return response.json();
  }

  // Xóa tất cả predictions
  async deleteAllPredictions(): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/predictions/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete all predictions');
    }

    return response.json();
  }

  // Lấy thống kê
  async getStats(): Promise<Stats> {
    const response = await fetch(`${this.baseURL}/stats/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export class cho testing
export default APIService;

