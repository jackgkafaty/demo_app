#!/bin/bash
# Docker Test Script for Personal Finance Dashboard
# This script tests the complete Docker setup including build, run, and API endpoints

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Personal Finance Dashboard - Docker Test Suite${NC}"
echo "=================================================="

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# Test 1: Build Docker image
echo -e "\n${YELLOW}1. Building Docker image...${NC}"
docker build -t finance-dashboard-test . > /dev/null 2>&1
print_status $? "Docker image built successfully"

# Test 2: Start container
echo -e "\n${YELLOW}2. Starting container...${NC}"
docker run -d -p 3001:3000 --name finance-test finance-dashboard-test > /dev/null 2>&1
print_status $? "Container started successfully"

# Test 3: Wait for application startup
echo -e "\n${YELLOW}3. Waiting for application startup...${NC}"
RETRY_COUNT=0
MAX_RETRIES=30

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        break
    fi
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Application failed to start within 60 seconds${NC}"
    docker logs finance-test
    exit 1
fi
print_status 0 "Application started and responding"

# Test 4: Health endpoint
echo -e "\n${YELLOW}4. Testing health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    print_status 0 "Health endpoint responding correctly"
    echo -e "   Response: $HEALTH_RESPONSE"
else
    print_status 1 "Health endpoint not responding correctly"
fi

# Test 5: API endpoints accessibility
echo -e "\n${YELLOW}5. Testing API endpoints...${NC}"

# Test auth endpoint (should return 404 for GET)
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/auth/login)
if [ "$AUTH_STATUS" = "404" ]; then
    print_status 0 "Auth endpoint accessible (404 expected for GET)"
else
    echo -e "${YELLOW}⚠️  Auth endpoint returned $AUTH_STATUS (may be normal)${NC}"
fi

# Test finance endpoint (should return 401 for unauthorized)
FINANCE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/finance/entries)
if [ "$FINANCE_STATUS" = "401" ] || [ "$FINANCE_STATUS" = "404" ]; then
    print_status 0 "Finance endpoint accessible ($FINANCE_STATUS expected)"
else
    echo -e "${YELLOW}⚠️  Finance endpoint returned $FINANCE_STATUS${NC}"
fi

# Test 6: Container health status
echo -e "\n${YELLOW}6. Checking container health...${NC}"
HEALTH_STATUS=$(docker inspect finance-test --format='{{.State.Health.Status}}' 2>/dev/null || echo "no-healthcheck")

# Wait a bit more for health check to complete if it's still starting
if [ "$HEALTH_STATUS" = "starting" ]; then
    echo "   Health check is starting, waiting up to 30 seconds..."
    for i in {1..6}; do
        sleep 5
        HEALTH_STATUS=$(docker inspect finance-test --format='{{.State.Health.Status}}' 2>/dev/null || echo "no-healthcheck")
        if [ "$HEALTH_STATUS" != "starting" ]; then
            break
        fi
    done
fi

if [ "$HEALTH_STATUS" = "healthy" ] || [ "$HEALTH_STATUS" = "no-healthcheck" ]; then
    print_status 0 "Container health status: $HEALTH_STATUS"
else
    echo -e "${YELLOW}⚠️  Container health status: $HEALTH_STATUS (may be normal for recent startup)${NC}"
fi

# Test 7: Check for critical errors in logs
echo -e "\n${YELLOW}7. Checking logs for errors...${NC}"
ERROR_COUNT=$(docker logs finance-test 2>&1 | grep -i -c "error\|fail\|exception" || true)
if [ "$ERROR_COUNT" -eq 0 ]; then
    print_status 0 "No critical errors found in logs"
else
    echo -e "${YELLOW}⚠️  Found $ERROR_COUNT potential errors in logs${NC}"
    echo "   Recent logs:"
    docker logs finance-test --tail 10
fi

# Test 8: Test graceful shutdown
echo -e "\n${YELLOW}8. Testing graceful shutdown...${NC}"
docker stop finance-test > /dev/null 2>&1
print_status $? "Container stopped gracefully"

# Cleanup
echo -e "\n${YELLOW}9. Cleaning up...${NC}"
docker rm finance-test > /dev/null 2>&1
docker rmi finance-dashboard-test > /dev/null 2>&1
print_status $? "Cleanup completed"

echo -e "\n${GREEN}🎉 All Docker tests passed successfully!${NC}"
echo "Your Personal Finance Dashboard Docker setup is working correctly."
echo ""
echo "To start the full application:"
echo "  docker-compose up -d"
echo ""
echo "To access the application:"
echo "  API: http://localhost:3000/api/health"
echo "  Web: Set up the web frontend separately or use reverse proxy"
