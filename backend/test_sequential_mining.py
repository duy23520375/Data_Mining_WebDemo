"""
Script test Sequential Mining Recommender
Chạy script này để test các chức năng của recommender
"""

from sequential_mining import get_recommender

def test_basic_recommendation():
    """Test basic recommendation flow"""
    print("=" * 80)
    print("TEST 1: Basic Recommendation - Machine Learning")
    print("=" * 80)
    
    recommender = get_recommender()
    result = recommender.get_full_recommendation(
        target_topic="Machine Learning",
        max_steps=None,
        courses_per_step=3
    )
    
    print(f"\nSuccess: {result['success']}")
    print(f"Message: {result['message']}")
    print(f"Target: {result.get('target_topic', 'N/A')}")
    print(f"Total Steps: {result['total_steps']}")
    print(f"Path: {' → '.join(result['path'])}")
    
    print("\nCourses per step:")
    for step in result['steps']:
        print(f"\n  Step {step['step_number']}: {step['topic']}")
        print(f"  Has courses: {step['has_courses']}")
        if step['has_courses'] and step['courses']:
            for i, course in enumerate(step['courses'][:2], 1):  # Show top 2
                print(f"    {i}. {course['title']}")
                print(f"       Rating: {course['rating']}, Students: {course['students']}, Bestseller: {course['is_bestseller']}")

def test_web_development():
    """Test web development path"""
    print("\n" + "=" * 80)
    print("TEST 2: Web Development Path - React JS")
    print("=" * 80)
    
    recommender = get_recommender()
    result = recommender.get_full_recommendation(
        target_topic="React JS",
        max_steps=None,
        courses_per_step=2
    )
    
    print(f"\nSuccess: {result['success']}")
    print(f"Path: {' → '.join(result['path'])}")
    print(f"Total Steps: {result['total_steps']}")

def test_invalid_topic():
    """Test với topic không tồn tại"""
    print("\n" + "=" * 80)
    print("TEST 3: Invalid Topic - Blockchain")
    print("=" * 80)
    
    recommender = get_recommender()
    result = recommender.get_full_recommendation(
        target_topic="Blockchain",
        max_steps=None,
        courses_per_step=3
    )
    
    print(f"\nSuccess: {result['success']}")
    print(f"Message: {result['message']}")

def test_max_steps():
    """Test giới hạn số steps"""
    print("\n" + "=" * 80)
    print("TEST 4: Limited Steps - Machine Learning (max 3 steps)")
    print("=" * 80)
    
    recommender = get_recommender()
    result = recommender.get_full_recommendation(
        target_topic="Machine Learning",
        max_steps=3,
        courses_per_step=2
    )
    
    print(f"\nSuccess: {result['success']}")
    print(f"Path: {' → '.join(result['path'])}")
    print(f"Total Steps: {result['total_steps']} (limited to 3)")

def test_search_courses():
    """Test tìm kiếm khóa học"""
    print("\n" + "=" * 80)
    print("TEST 5: Search Courses - Python")
    print("=" * 80)
    
    recommender = get_recommender()
    courses = recommender.search_courses_by_keyword("Python", top_n=5)
    
    print(f"\nFound {len(courses)} courses:")
    for i, course in enumerate(courses, 1):
        print(f"\n{i}. {course['title']}")
        print(f"   Rating: {course['rating']}, Students: {course['students']}")
        print(f"   Bestseller: {course['is_bestseller']}")

def test_available_topics():
    """Test lấy danh sách topics"""
    print("\n" + "=" * 80)
    print("TEST 6: Available Topics")
    print("=" * 80)
    
    recommender = get_recommender()
    topics = recommender.get_available_topics()
    
    print(f"\nTotal topics: {len(topics)}")
    print(f"Topics: {', '.join(topics)}")

def test_deep_learning_path():
    """Test Deep Learning path"""
    print("\n" + "=" * 80)
    print("TEST 7: Deep Learning Path")
    print("=" * 80)
    
    recommender = get_recommender()
    result = recommender.get_full_recommendation(
        target_topic="Deep Learning",
        max_steps=None,
        courses_per_step=3
    )
    
    print(f"\nSuccess: {result['success']}")
    print(f"Path: {' → '.join(result['path'])}")
    print(f"Total Steps: {result['total_steps']}")
    
    # Show some course details
    if result['success'] and result['steps']:
        last_step = result['steps'][-1]  # Deep Learning step
        print(f"\nDeep Learning courses:")
        for i, course in enumerate(last_step['courses'], 1):
            print(f"  {i}. {course['title']}")
            print(f"     Price: ${course['price']}, Duration: {course['duration']}")

def run_all_tests():
    """Chạy tất cả tests"""
    print("\n")
    print("█" * 80)
    print("  SEQUENTIAL MINING RECOMMENDER - TEST SUITE")
    print("█" * 80)
    
    try:
        test_basic_recommendation()
        test_web_development()
        test_invalid_topic()
        test_max_steps()
        test_search_courses()
        test_available_topics()
        test_deep_learning_path()
        
        print("\n" + "=" * 80)
        print("✅ ALL TESTS COMPLETED")
        print("=" * 80)
        
    except Exception as e:
        print("\n" + "=" * 80)
        print(f"❌ TEST FAILED: {str(e)}")
        print("=" * 80)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_all_tests()

