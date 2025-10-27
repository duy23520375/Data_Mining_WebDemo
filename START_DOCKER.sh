#!/bin/bash

# Start Docker containers for Udemy Sequential Mining WebDemo
# Linux/Mac Shell Script

echo "========================================"
echo "  Starting Udemy WebDemo with Docker"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker is not installed!${NC}"
    echo "Please install Docker from: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}[ERROR] Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo -e "${RED}[ERROR] Docker is not running!${NC}"
    echo "Please start Docker daemon and try again."
    exit 1
fi

echo -e "${GREEN}[INFO] Docker is ready!${NC}"
echo ""

# Ask user for mode
echo "Select mode:"
echo "1. Production (optimized, recommended)"
echo "2. Development (hot reload)"
echo ""
read -p "Enter choice (1 or 2): " mode

if [ "$mode" = "2" ]; then
    echo ""
    echo -e "${YELLOW}[INFO] Starting in DEVELOPMENT mode...${NC}"
    echo -e "${GREEN}[INFO] Frontend will be at: http://localhost:5173${NC}"
    echo -e "${GREEN}[INFO] Backend will be at: http://localhost:8000${NC}"
    echo -e "${GREEN}[INFO] Hot reload enabled for both services${NC}"
    echo ""
    docker-compose -f docker-compose.dev.yml up --build
else
    echo ""
    echo -e "${YELLOW}[INFO] Starting in PRODUCTION mode...${NC}"
    echo -e "${GREEN}[INFO] Frontend will be at: http://localhost${NC}"
    echo -e "${GREEN}[INFO] Backend will be at: http://localhost:8000${NC}"
    echo ""
    docker-compose up --build
fi

echo ""
echo -e "${GREEN}[INFO] Containers stopped.${NC}"

