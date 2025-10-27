"""
Sequential Mining Module
Kết hợp Graph-based Sequential Mining và PrefixSpan Algorithm
để recommend learning path cho người dùng
"""

import pandas as pd
import networkx as nx
import ast
import re
from typing import List, Dict, Any, Tuple, Optional
from pathlib import Path

class SequentialMiningRecommender:
    """Class xử lý sequential mining và recommendation"""
    
    def __init__(self, data_path: str = "data_final_fix.csv"):
        """
        Khởi tạo recommender với data
        
        Args:
            data_path: Đường dẫn tới file CSV chứa dữ liệu khóa học
        """
        # Try to find CSV file in multiple locations
        possible_paths = [
            Path(__file__).parent / data_path,  # backend/data_final_fix.csv
            Path(__file__).parent.parent / data_path,  # root/data_final_fix.csv
            Path(__file__).parent.parent / "data_final_fix.csv",  # root/data_final_fix.csv
        ]
        
        # Find existing file
        self.data_path = None
        for path in possible_paths:
            if path.exists():
                self.data_path = path
                break
        
        # If not found, use first path
        if self.data_path is None:
            self.data_path = possible_paths[0]
        self.df = None
        self.df_clean = None
        self.knowledge_graph = None
        self.topic_to_courses = {}
        
        # Load data và khởi tạo
        self._load_and_prepare_data()
        self._build_knowledge_graph()
        self._map_courses_to_topics()
    
    def _parse_topics(self, topics_str: Any) -> List[str]:
        """Parse chuỗi related_topics thành list"""
        if not isinstance(topics_str, str) or topics_str == "[]":
            return []
        try:
            if topics_str.startswith('[') and topics_str.endswith(']'):
                parsed_list = ast.literal_eval(topics_str)
                return [str(item).strip() for item in parsed_list]
            else:
                return [topic.strip() for topic in topics_str.split(',')]
        except Exception:
            return []
    
    def _clean_numeric(self, value_str: Any) -> float:
        """Làm sạch và chuyển đổi giá trị số"""
        if not isinstance(value_str, str):
            return 0
        cleaned_str = re.sub(r"[^0-9.]", "", value_str)
        try:
            return float(cleaned_str)
        except ValueError:
            return 0
    
    def _load_and_prepare_data(self):
        """Load và chuẩn bị data"""
        try:
            self.df = pd.read_csv(self.data_path)
            
            # Parse và clean data
            self.df['related_topics'] = self.df['related_topics'].apply(self._parse_topics)
            self.df['num_reviews'] = self.df['num_reviews'].apply(self._clean_numeric)
            self.df['num_students'] = self.df['num_students'].apply(self._clean_numeric)
            self.df['rating'] = pd.to_numeric(self.df['rating'], errors='coerce').fillna(0)
            self.df['is_bestseller'] = self.df['is_bestseller'].apply(
                lambda x: True if x == 'Yes' else False
            )
            
            # Tạo dataframe clean
            self.df_clean = self.df[[
                'title', 'related_topics', 'num_reviews', 'num_students', 
                'rating', 'is_bestseller', 'instructor', 'price', 'lectures', 
                'sections', 'total_length', 'course_url'
            ]].copy()
            
        except Exception as e:
            print(f"Error loading data: {e}")
            # Tạo empty dataframe nếu load fail
            self.df_clean = pd.DataFrame()
    
    def _build_knowledge_graph(self):
        """Xây dựng knowledge graph về learning paths"""
        G = nx.DiGraph()
        
        # Data Science / AI / ML Path
        G.add_edges_from([
            ('Python', 'Numpy'),
            ('Python', 'Pandas'),
            ('Python', 'Data Science'),
            ('SQL', 'Data Science'),
            ('Numpy', 'Machine Learning'),
            ('Pandas', 'Machine Learning'),
            ('Data Science', 'Machine Learning'),
            ('Machine Learning', 'Deep Learning'),
            ('Machine Learning', 'Natural Language Processing (NLP)'),
            ('Deep Learning', 'Generative AI (GenAI)'),
            ('Deep Learning', 'Computer Vision'),
            ('Python', 'Artificial Intelligence (AI)'),
            ('Machine Learning', 'Artificial Intelligence (AI)'),
        ])
        
        # Web Development Path
        G.add_edges_from([
            ('HTML', 'CSS'),
            ('CSS', 'JavaScript'),
            ('JavaScript', 'React JS'),
            ('JavaScript', 'Node.Js'),
            ('JavaScript', 'Angular'),
            ('JavaScript', 'Vue JS'),
            ('HTML', 'Web Development'),
            ('CSS', 'Web Development'),
            ('JavaScript', 'Web Development'),
            ('React JS', 'Web Development'),
        ])
        
        # Programming Languages Path
        G.add_edges_from([
            ('Java', 'Programming Languages'),
            ('Python', 'Programming Languages'),
            ('C++', 'Programming Languages'),
            ('C#', 'Programming Languages'),
        ])
        
        # IT & Infrastructure Path
        G.add_edges_from([
            ('Operating Systems & Servers', 'Network & Security'),
            ('Python', 'Network & Security'),
        ])
        
        # Cloud & DevOps Path
        G.add_edges_from([
            ('Linux', 'DevOps'),
            ('Docker', 'DevOps'),
            ('Kubernetes', 'DevOps'),
            ('Python', 'DevOps'),
        ])
        
        self.knowledge_graph = G
    
    def _map_courses_to_topics(self):
        """Map các khóa học với topics trong knowledge graph"""
        if self.df_clean is None or self.df_clean.empty:
            return
            
        graph_topics = set(self.knowledge_graph.nodes)
        
        for index, course in self.df_clean.iterrows():
            course_topics = set(course['related_topics'])
            relevant_topics = graph_topics.intersection(course_topics)
            
            if relevant_topics:
                course_details = {
                    'title': course['title'],
                    'rating': float(course['rating']),
                    'students': int(course['num_students']),
                    'is_bestseller': bool(course['is_bestseller']),
                    'instructor': str(course['instructor']),
                    'price': float(course['price']) if pd.notna(course['price']) else 0,
                    'lectures': int(course['lectures']) if pd.notna(course['lectures']) else 0,
                    'sections': int(course['sections']) if pd.notna(course['sections']) else 0,
                    'duration': str(course['total_length']) if pd.notna(course['total_length']) else "N/A",
                    'url': str(course['course_url'])
                }
                
                for topic in relevant_topics:
                    if topic not in self.topic_to_courses:
                        self.topic_to_courses[topic] = []
                    self.topic_to_courses[topic].append(course_details)
    
    def find_learning_path(
        self, 
        target_topic: str, 
        max_steps: Optional[int] = None
    ) -> Tuple[Optional[List[str]], str]:
        """
        Tìm learning path logic đến một topic mục tiêu
        
        Args:
            target_topic: Topic mục tiêu muốn học
            max_steps: Số bước tối đa (None = toàn bộ path)
            
        Returns:
            Tuple (path, message)
        """
        if target_topic not in self.knowledge_graph:
            # Tìm topic gần nhất
            similar_topics = [
                t for t in self.knowledge_graph.nodes() 
                if target_topic.lower() in t.lower() or t.lower() in target_topic.lower()
            ]
            if similar_topics:
                return None, f"Không tìm thấy '{target_topic}'. Có phải bạn muốn tìm: {', '.join(similar_topics)}?"
            return None, f"Topic '{target_topic}' không có trong knowledge graph."
        
        # Tìm tất cả prerequisites
        try:
            prerequisites = nx.ancestors(self.knowledge_graph, target_topic)
        except nx.NetworkXError:
            return [target_topic], "Đây là topic gốc (không cần prerequisites)."
        
        # Tạo curriculum nodes
        curriculum_nodes = prerequisites.union({target_topic})
        
        # Tạo subgraph và sort theo thứ tự topology
        curriculum_graph = self.knowledge_graph.subgraph(curriculum_nodes)
        
        try:
            logical_path = list(nx.topological_sort(curriculum_graph))
            
            # Giới hạn số bước nếu được yêu cầu
            if max_steps and max_steps < len(logical_path):
                logical_path = logical_path[-max_steps:]
                
            return logical_path, "Tìm thấy learning path."
        except nx.NetworkXUnfeasible:
            return None, "Lỗi: Phát hiện circular dependency trong graph."
    
    def recommend_courses_for_topic(
        self, 
        topic: str, 
        top_n: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Recommend các khóa học tốt nhất cho một topic
        
        Args:
            topic: Topic cần recommend
            top_n: Số lượng khóa học tối đa
            
        Returns:
            List các khóa học được recommend
        """
        courses = self.topic_to_courses.get(topic, [])
        
        if not courses:
            return []
        
        # Sắp xếp theo: bestseller > rating > số students
        sorted_courses = sorted(
            courses,
            key=lambda x: (x['is_bestseller'], x['rating'], x['students']),
            reverse=True
        )
        
        return sorted_courses[:top_n]
    
    def get_full_recommendation(
        self,
        target_topic: str,
        max_steps: Optional[int] = None,
        courses_per_step: int = 3
    ) -> Dict[str, Any]:
        """
        Lấy full recommendation bao gồm learning path và courses
        
        Args:
            target_topic: Topic mục tiêu
            max_steps: Số bước tối đa trong path
            courses_per_step: Số khóa học cho mỗi bước
            
        Returns:
            Dict chứa path và recommendations
        """
        # Tìm learning path
        path, message = self.find_learning_path(target_topic, max_steps)
        
        if not path:
            return {
                "success": False,
                "message": message,
                "path": [],
                "steps": []
            }
        
        # Build recommendations cho mỗi step
        steps = []
        for i, topic in enumerate(path):
            courses = self.recommend_courses_for_topic(topic, courses_per_step)
            steps.append({
                "step_number": i + 1,
                "topic": topic,
                "courses": courses,
                "has_courses": len(courses) > 0
            })
        
        return {
            "success": True,
            "message": message,
            "target_topic": target_topic,
            "path": path,
            "total_steps": len(path),
            "steps": steps
        }
    
    def search_courses_by_keyword(
        self, 
        keyword: str, 
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Tìm kiếm khóa học theo keyword
        
        Args:
            keyword: Từ khóa tìm kiếm
            top_n: Số lượng kết quả
            
        Returns:
            List các khóa học phù hợp
        """
        if self.df_clean is None or self.df_clean.empty:
            return []
        
        keyword_lower = keyword.lower()
        
        # Tìm trong title và related_topics
        mask = self.df_clean['title'].str.lower().str.contains(keyword_lower, na=False)
        
        results = []
        for _, course in self.df_clean[mask].iterrows():
            results.append({
                'title': course['title'],
                'rating': float(course['rating']),
                'students': int(course['num_students']),
                'is_bestseller': bool(course['is_bestseller']),
                'instructor': str(course['instructor']),
                'price': float(course['price']) if pd.notna(course['price']) else 0,
                'lectures': int(course['lectures']) if pd.notna(course['lectures']) else 0,
                'sections': int(course['sections']) if pd.notna(course['sections']) else 0,
                'duration': str(course['total_length']) if pd.notna(course['total_length']) else "N/A",
                'topics': course['related_topics'],
                'url': str(course['course_url'])
            })
        
        # Sort theo bestseller và rating
        results.sort(
            key=lambda x: (x['is_bestseller'], x['rating'], x['students']),
            reverse=True
        )
        
        return results[:top_n]
    
    def get_available_topics(self) -> List[str]:
        """Lấy danh sách tất cả topics có trong knowledge graph"""
        return sorted(list(self.knowledge_graph.nodes()))


# Singleton instance
_recommender_instance = None

def get_recommender() -> SequentialMiningRecommender:
    """Get singleton instance của recommender"""
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = SequentialMiningRecommender()
    return _recommender_instance

