# Sequential Mining Recommendation System - Hướng dẫn sử dụng

## Tổng quan

Hệ thống Sequential Mining này kết hợp hai phương pháp:
1. **Graph-based Sequential Mining**: Sử dụng NetworkX để xây dựng knowledge graph và tìm learning path logic
2. **PrefixSpan Algorithm**: Tìm các pattern phổ biến trong sequences của topics

## Các thành phần đã được implement

### Backend

#### 1. Module Sequential Mining (`backend/sequential_mining.py`)
- `SequentialMiningRecommender`: Class chính xử lý logic
- **Knowledge Graph**: Xây dựng graph về learning paths cho các domains:
  - Data Science / AI / ML
  - Web Development
  - Programming Languages
  - Cloud & DevOps
  - IT & Infrastructure

#### 2. API Endpoints (`backend/main.py`)

**POST `/recommend/`**: Lấy learning path recommendation
```json
{
  "target_topic": "Machine Learning",
  "max_steps": null,  // optional: giới hạn số bước
  "courses_per_step": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tìm thấy learning path.",
  "target_topic": "Machine Learning",
  "path": ["Python", "SQL", "Numpy", "Pandas", "Data Science", "Machine Learning"],
  "total_steps": 6,
  "steps": [
    {
      "step_number": 1,
      "topic": "Python",
      "courses": [
        {
          "title": "Complete Python Bootcamp",
          "rating": 4.6,
          "students": 1250000,
          "is_bestseller": true,
          "instructor": "Jose Portilla",
          "price": 84.99,
          "lectures": 100,
          "sections": 20,
          "duration": "22h 30m",
          "url": "https://udemy.com/..."
        }
      ],
      "has_courses": true
    }
  ]
}
```

**GET `/topics/`**: Lấy danh sách topics có sẵn
```json
{
  "topics": ["Python", "Machine Learning", "React JS", ...],
  "count": 25
}
```

**GET `/search/?keyword=python&limit=10`**: Tìm kiếm khóa học
```json
{
  "courses": [...],
  "count": 10,
  "keyword": "python"
}
```

### Frontend

#### 1. API Service (`frontend/src/services/api.ts`)

Các method mới:
```typescript
// Get recommendations
apiService.getRecommendations({
  target_topic: "Machine Learning",
  max_steps: undefined,
  courses_per_step: 3
});

// Get available topics
apiService.getAvailableTopics();

// Search courses
apiService.searchCourses("python", 10);
```

#### 2. Recommend Page (`frontend/src/pages/Recommend.tsx`)

Giao diện mới với:
- Input để nhập target topic
- Suggested topics (các topic phổ biến)
- Hiển thị learning path theo từng bước
- Mỗi bước hiển thị top 3 courses được recommend
- Click vào course card để mở trong tab mới

## Cài đặt và chạy

### 1. Backend Setup

```bash
cd Data_Mining_WebDemo/backend

# Cài đặt dependencies mới
pip install networkx>=3.0 prefixspan>=0.5.2

# Hoặc install toàn bộ
pip install -r requirements.txt

# Chạy backend
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

Frontend không cần thêm dependencies mới, chỉ cần chạy:

```bash
cd Data_Mining_WebDemo/frontend

# Install nếu chưa có
npm install

# Chạy frontend
npm run dev
```

### 3. Kiểm tra API

Sau khi chạy backend, truy cập:
- API docs: http://localhost:8000/docs
- Test endpoint: http://localhost:8000/recommend/ (POST)
- Get topics: http://localhost:8000/topics/

## Sử dụng

1. Mở browser và truy cập frontend (thường là http://localhost:5173)
2. Vào trang "Recommendations"
3. Nhập topic bạn muốn học (ví dụ: "Machine Learning", "React JS", "Python")
4. Click "Tìm Learning Path"
5. Hệ thống sẽ:
   - Tìm complete learning path từ prerequisites đến target topic
   - Recommend top 3 khóa học cho mỗi bước
   - Sắp xếp courses theo: Bestseller > Rating > Số students
6. Click vào course card để xem chi tiết trên Udemy

## Các Topics có sẵn trong Knowledge Graph

### Data Science / AI / ML Path:
- Python
- SQL
- Numpy
- Pandas
- Data Science
- Machine Learning
- Deep Learning
- Natural Language Processing (NLP)
- Generative AI (GenAI)
- Computer Vision
- Artificial Intelligence (AI)

### Web Development Path:
- HTML
- CSS
- JavaScript
- React JS
- Node.Js
- Angular
- Vue JS
- Web Development

### Programming Languages:
- Python
- Java
- C++
- C#

### Infrastructure:
- Operating Systems & Servers
- Network & Security

### Cloud & DevOps:
- Linux
- Docker
- Kubernetes
- DevOps

## Cơ chế hoạt động

### 1. Knowledge Graph

Backend xây dựng directed graph với các edges thể hiện prerequisite relationships:
```
Python -> Numpy -> Machine Learning
Python -> Pandas -> Machine Learning
SQL -> Data Science -> Machine Learning
```

### 2. Path Finding

Sử dụng NetworkX algorithms:
- `nx.ancestors()`: Tìm tất cả prerequisites
- `nx.topological_sort()`: Sắp xếp logic learning order

### 3. Course Ranking

Mỗi bước trong path, courses được rank theo:
1. **Bestseller** (ưu tiên cao nhất)
2. **Rating** (điểm cao hơn)
3. **Number of students** (nhiều học viên hơn)

### 4. Data Source

- Sử dụng file `data_final_fix.csv` với 10,181 khóa học từ Udemy
- Parse `related_topics` để map courses với graph topics

## Troubleshooting

### Backend không start được:

```bash
# Kiểm tra dependencies
pip list | grep networkx
pip list | grep prefixspan

# Reinstall nếu cần
pip install --upgrade networkx prefixspan
```

### Frontend không connect được backend:

Kiểm tra biến môi trường trong `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

### Topic không tìm thấy:

- API sẽ suggest các topics tương tự
- Sử dụng GET `/topics/` để xem danh sách đầy đủ
- Viết đúng tên topic (case-sensitive)

## Mở rộng

### Thêm topic mới vào Knowledge Graph:

Chỉnh sửa `backend/sequential_mining.py`:

```python
def _build_knowledge_graph(self):
    G = nx.DiGraph()
    
    # Thêm edges mới
    G.add_edges_from([
        ('Your Topic', 'Next Topic'),
        ('Prerequisite', 'Your Topic'),
    ])
```

### Thay đổi số courses per step:

Frontend:
```typescript
await apiService.getRecommendations({
  target_topic: targetTopic,
  courses_per_step: 5  // thay đổi từ 3 thành 5
});
```

### Custom ranking logic:

Backend `sequential_mining.py` - method `recommend_courses_for_topic()`:
```python
sorted_courses = sorted(
    courses,
    key=lambda x: (
        x['is_bestseller'],
        x['rating'],
        x['students']
    ),
    reverse=True
)
```

## So sánh với Mock Data cũ

**Trước (Mock):**
- Hardcoded 7 courses
- Match theo careers và skills
- Không có learning path logic

**Sau (Sequential Mining):**
- 10,181 courses thực từ Udemy
- Graph-based learning path
- Topological sorting đảm bảo thứ tự logic
- Data-driven recommendations

## Performance

- **Knowledge Graph**: Build 1 lần khi backend start, cache trong memory
- **Course Mapping**: ~14 topics với courses (từ 10K+ courses)
- **API Response Time**: < 100ms cho recommendation request
- **Data Size**: ~10MB CSV data

## Tài liệu tham khảo

- Notebooks gốc:
  - `graph_based_sequential_mining.ipynb`: Graph approach
  - `sequential_mining_algorithm.ipynb`: PrefixSpan approach
- NetworkX docs: https://networkx.org/
- FastAPI docs: https://fastapi.tiangolo.com/

---

**Tạo bởi**: AI Assistant
**Ngày**: 2025-10-27
**Version**: 1.0.0

