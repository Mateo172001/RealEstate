#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Real Estate Application Startup    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Start Docker Compose
echo -e "${YELLOW}📦 Starting Docker containers...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start Docker containers${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
echo ""

# Function to check if a service is healthy
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=0

    echo -e "${BLUE}   Checking $service_name...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}   ✓ $service_name is ready!${NC}"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    echo -e "${RED}   ✗ $service_name failed to start${NC}"
    return 1
}

# Wait for MongoDB
echo -e "${BLUE}1. MongoDB...${NC}"
sleep 3
echo -e "${GREEN}   ✓ MongoDB is ready!${NC}"

# Wait for API
echo ""
echo -e "${BLUE}2. Backend API...${NC}"
check_service "API" "http://localhost:8080/health"

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}💡 Tip: Check logs with: docker-compose logs api${NC}"
    exit 1
fi

# Wait for Frontend
echo ""
echo -e "${BLUE}3. Frontend...${NC}"
check_service "Frontend" "http://localhost:3000"

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}💡 Tip: Check logs with: docker-compose logs frontend${NC}"
    exit 1
fi

# All services ready!
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     All Services Are Ready! 🎉        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Application URLs:${NC}"
echo -e "   Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "   API:       ${GREEN}http://localhost:8080${NC}"
echo -e "   Swagger:   ${GREEN}http://localhost:8080/swagger${NC}"
echo -e "   Health:    ${GREEN}http://localhost:8080/health${NC}"
echo ""

# Open browser
echo -e "${YELLOW}🌐 Opening frontend in browser...${NC}"
sleep 2

# Detect OS and open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000
    elif command -v gnome-open > /dev/null; then
        gnome-open http://localhost:3000
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start http://localhost:3000
fi

echo ""
echo -e "${GREEN}✅ Frontend opened in your default browser!${NC}"
echo ""
echo -e "${BLUE}📝 Useful commands:${NC}"
echo -e "   View logs:        ${YELLOW}docker-compose logs -f${NC}"
echo -e "   Stop services:    ${YELLOW}docker-compose down${NC}"
echo -e "   Restart:          ${YELLOW}docker-compose restart${NC}"
echo ""

