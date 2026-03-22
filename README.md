# 🎓 Udemy Bestseller Predictor & Learning Path Recommender

[![Tech Stack](https://img.shields.io/badge/Stack-Fullstack_AI-blue)](https://github.com/your-username/repo)
[![Model Accuracy](https://img.shields.io/badge/Accuracy-91.6%25-green)](https://github.com/your-username/repo)
[![Python](https://img.shields.io/badge/Python-3.9+-yellow)](https://python.org)

Hệ thống toàn diện ứng dụng **Machine Learning** để dự đoán các khóa học Bestseller trên Udemy và khai phá **Sequential Patterns** để gợi ý lộ trình học tập cá nhân hóa. Dự án xử lý toàn bộ vòng đời dữ liệu: từ Crawling chống bot, Feature Engineering phức tạp đến triển khai Web App.

---

## 🚀 Key Features

* **Anti-Bot Data Crawling:** Hệ thống tự động thu thập hơn 10,000 khóa học sử dụng **Selenium** & **Undetected-Chromedriver**.
* **Bestseller Prediction:** Mô hình **Random Forest** tối ưu qua GridSearchCV đạt **ROC-AUC 0.95**, giúp dự đoán khả năng thành công của khóa học.
* **Smart Learning Paths:** Khai phá quy luật học tập bằng thuật toán **PrefixSpan** (Sequential Pattern Mining).
* **Difficulty Estimation:** Bộ máy Heuristic tự động phân loại 3 cấp độ (Beginner/Intermediate/Advanced) dựa trên đa tín hiệu.
* **Modern Dashboard:** Giao diện trực quan hóa roadmap bằng **React (Vite)**, **Tailwind CSS** và **Recharts**.

---

## 🛠 Tech Stack

### AI & Data Mining
* **Language:** Python
* **Mining:** PrefixSpan, TF-IDF (Keywords Extraction)
* **ML Libraries:** Scikit-learn, XGBoost, LightGBM
* **Preprocessing:** RobustScaler, SMOTE (Handle Imbalance), Regex
* **Storage:** CSV, Pickle (Model & Scaler Serialization)

### Fullstack Development
* **Backend:** FastAPI (Python), Dockerized Environment
* **Frontend:** React 18, TypeScript, Vite, shadcn/ui
* **DevOps:** Docker, Docker Compose, Nginx

---

## 📂 Project Structure

```text
.
├── backend/               # FastAPI Server & ML Inference
│   ├── ml_model.py        # Model logic & Prediction
│   ├── sequential_mining.py # PrefixSpan implementation
│   ├── model.pkl          # Pre-trained Random Forest
│   └── scaler_final.pkl   # RobustScaler for inference
├── frontend/              # React + TypeScript Web App
│   ├── src/pages/         # Predict & Analytics Dashboards
│   └── lib/featureEng.ts  # Frontend side feature transformation
├── notebooks/             # EDA & Model Training experiments
└── docker-compose.yml     # Orchestration for the entire system
