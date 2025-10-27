# Sequential Mining Module - Backend

## Tổng quan

Module này implement Sequential Mining để recommend learning paths dựa trên Graph-based approach và data từ Udemy courses.

## File Structure

```
backend/
├── sequential_mining.py          # Main module với SequentialMiningRecommender class
├── main.py                       # FastAPI endpoints (đã được cập nhật)
├── test_sequential_mining.py     # Python test script
├── test_api.sh                   # Bash script test API (Linux/Mac)
├── test_api.ps1                  # PowerShell script test API (Windows)
└── data_final_fix.csv            # Data source (10,181 courses)
```

## Quick Start

### 1. Cài đặt dependencies

```bash
pip install networkx>=3.0 prefixspan>=0.5.2
# hoặc
pip install -r requirements.txt
```

### 2. Test module trực tiếp

```bash
python test_sequential_mining.py
```

Sẽ chạy 7 tests:
- Basic recommendation (Machine Learning)
- Web development path (React JS)
- Invalid topic handling
- Limited steps
- Search courses
- Available topics
- Deep Learning path

### 3. Chạy backend server

```bash
python -m uvicorn main:app --reload --port 8000
```

### 4. Test API endpoints

**Windows (PowerShell):**
```powershell
.\test_api.ps1
```

**Linux/Mac (Bash):**
```bash
bash test_api.sh
```

**Manual với curl:**
```bash
# Get topics
curl http://localhost:8000/topics/

# Get recommendation
curl -X POST http://localhost:8000/recommend/ \
  -H "Content-Type: application/json" \
  -d '{"target_topic": "Machine Learning", "courses_per_step": 3}'
```

## API Endpoints

### POST /recommend/
Lấy learning path recommendation

**Request:**
```json
{
  "target_topic": "Machine Learning",
  "max_steps": null,
  "courses_per_step": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tìm thấy learning path.",
  "target_topic": "Machine Learning",
  "path": ["Python", "Numpy", "Pandas", "Data Science", "Machine Learning"],
  "total_steps": 5,
  "steps": [...]
}
```

### GET /topics/
Lấy danh sách topics có sẵn

**Response:**
```json
{
  "topics": ["Python", "Machine Learning", ...],
  "count": 25
}
```

### GET /search/?keyword={keyword}&limit={limit}
Tìm kiếm khóa học

**Response:**
```json
{
  "courses": [...],
  "count": 10,
  "keyword": "python"
}
```

## Module Usage

```python
from sequential_mining import get_recommender

# Get recommender instance
recommender = get_recommender()

# Get full recommendation
result = recommender.get_full_recommendation(
    target_topic="Machine Learning",
    max_steps=None,
    courses_per_step=3
)

# Search courses
courses = recommender.search_courses_by_keyword("Python", top_n=10)

# Get available topics
topics = recommender.get_available_topics()
```

## Knowledge Graph Topics

### Data Science / AI:
- Python, SQL, Numpy, Pandas
- Data Science, Machine Learning
- Deep Learning, NLP, Computer Vision
- Generative AI (GenAI)
- Artificial Intelligence (AI)

### Web Development:
- HTML, CSS, JavaScript
- React JS, Node.Js, Angular, Vue JS
- Web Development

### Programming:
- Python, Java, C++, C#
- Programming Languages

### Infrastructure:
- Operating Systems & Servers
- Network & Security

### DevOps:
- Linux, Docker, Kubernetes, DevOps

## Algorithm

1. **Knowledge Graph**: Directed graph với prerequisite relationships
2. **Path Finding**: 
   - Sử dụng `nx.ancestors()` để tìm prerequisites
   - `nx.topological_sort()` để sắp xếp logic
3. **Course Ranking**: Bestseller > Rating > Students

## Performance

- Graph build: ~50ms (cached in memory)
- Course mapping: 14 topics từ 10K+ courses
- API response: < 100ms
- Data size: ~10MB CSV

## Troubleshooting

### Import Error: No module named 'networkx'
```bash
pip install networkx
```

### Import Error: No module named 'prefixspan'
```bash
pip install prefixspan
```

### FileNotFoundError: data_final_fix.csv
Đảm bảo file `data_final_fix.csv` nằm trong thư mục `backend/`

### Topic không tìm thấy
- Check available topics: GET /topics/
- Topic names are case-sensitive
- Example: "Machine Learning" không phải "machine learning"

## Development

### Thêm topic mới

Edit `sequential_mining.py` method `_build_knowledge_graph()`:

```python
G.add_edges_from([
    ('New Topic', 'Next Topic'),
    ('Prerequisite', 'New Topic'),
])
```

### Thay đổi ranking logic

Edit `sequential_mining.py` method `recommend_courses_for_topic()`:

```python
sorted_courses = sorted(
    courses,
    key=lambda x: (x['is_bestseller'], x['rating'], x['students']),
    reverse=True
)
```

### Debug mode

```python
import logging
logging.basicConfig(level=logging.DEBUG)

recommender = get_recommender()
```

## Related Files

- Main documentation: `../SEQUENTIAL_MINING_GUIDE.md`
- Frontend integration: `../frontend/src/services/api.ts`
- UI component: `../frontend/src/pages/Recommend.tsx`

## References

- NetworkX: https://networkx.org/
- FastAPI: https://fastapi.tiangolo.com/
- Original notebooks:
  - `../graph_based_sequential_mining.ipynb`
  - `../sequential_mining_algorithm.ipynb`

