#!/bin/bash

# Script test các API endpoints của Sequential Mining
# Usage: bash test_api.sh

BASE_URL="http://localhost:8000"

echo "=================================="
echo "SEQUENTIAL MINING API TEST SUITE"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}TEST 1: Health Check${NC}"
echo "GET $BASE_URL/"
curl -s "$BASE_URL/" | python -m json.tool
echo -e "\n"

# Test 2: Get Available Topics
echo -e "${YELLOW}TEST 2: Get Available Topics${NC}"
echo "GET $BASE_URL/topics/"
curl -s "$BASE_URL/topics/" | python -m json.tool
echo -e "\n"

# Test 3: Get Recommendations - Machine Learning
echo -e "${YELLOW}TEST 3: Get Recommendations - Machine Learning${NC}"
echo "POST $BASE_URL/recommend/"
curl -s -X POST "$BASE_URL/recommend/" \
  -H "Content-Type: application/json" \
  -d '{
    "target_topic": "Machine Learning",
    "max_steps": null,
    "courses_per_step": 3
  }' | python -m json.tool
echo -e "\n"

# Test 4: Get Recommendations - React JS
echo -e "${YELLOW}TEST 4: Get Recommendations - React JS${NC}"
echo "POST $BASE_URL/recommend/"
curl -s -X POST "$BASE_URL/recommend/" \
  -H "Content-Type: application/json" \
  -d '{
    "target_topic": "React JS",
    "max_steps": null,
    "courses_per_step": 2
  }' | python -m json.tool
echo -e "\n"

# Test 5: Get Recommendations - Limited Steps
echo -e "${YELLOW}TEST 5: Get Recommendations - Machine Learning (3 steps max)${NC}"
echo "POST $BASE_URL/recommend/"
curl -s -X POST "$BASE_URL/recommend/" \
  -H "Content-Type: application/json" \
  -d '{
    "target_topic": "Machine Learning",
    "max_steps": 3,
    "courses_per_step": 2
  }' | python -m json.tool
echo -e "\n"

# Test 6: Search Courses - Python
echo -e "${YELLOW}TEST 6: Search Courses - Python${NC}"
echo "GET $BASE_URL/search/?keyword=Python&limit=5"
curl -s "$BASE_URL/search/?keyword=Python&limit=5" | python -m json.tool
echo -e "\n"

# Test 7: Invalid Topic
echo -e "${YELLOW}TEST 7: Invalid Topic - Blockchain${NC}"
echo "POST $BASE_URL/recommend/"
curl -s -X POST "$BASE_URL/recommend/" \
  -H "Content-Type: application/json" \
  -d '{
    "target_topic": "Blockchain",
    "max_steps": null,
    "courses_per_step": 3
  }' | python -m json.tool
echo -e "\n"

# Test 8: Search Courses - No results
echo -e "${YELLOW}TEST 8: Search Courses - XYZ123 (should return no results)${NC}"
echo "GET $BASE_URL/search/?keyword=XYZ123&limit=5"
curl -s "$BASE_URL/search/?keyword=XYZ123&limit=5" | python -m json.tool
echo -e "\n"

echo "=================================="
echo -e "${GREEN}ALL API TESTS COMPLETED${NC}"
echo "=================================="

