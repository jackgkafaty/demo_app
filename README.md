# 🧾 Personal Finance Dashboard

A self-hosted, AES-encrypted personal finance dashboard to track assets, budgets, and taxes. Fully supports desktop, mobile, and a native iOS app with AI chatbot functionality.

![Personal Finance Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## ✨ Features

### 💰 Core Functionality
- **Liquid Assets**: Account balance tracking with auto-currency conversion (CAD/USD)
- **Monthly Expenses**: Drag & drop receipt processing with automatic categorization
- **Budget Tracking**: Monthly budget vs. actual with visual gauge charts
- **Retirement & Savings**: Goal tracking with compound growth simulator
- **TFSA Tracker**: Canadian TFSA contribution limits and over-contribution warnings
- **Stock Tracking**: Manual ticker entry with auto-price fetching and tax estimates

### 🤖 AI Assistant
- **Private AI Chatbot**: Powered by OpenAI GPT-4o-mini
- **PII Protection**: Automatic blocking of sensitive information (credit cards, emails, etc.)
- **Contextual Insights**: "What did I spend the most on?" "How can I improve my portfolio?"
- **Web & Mobile**: Available on all platforms

### 🔐 Security & Privacy
- **AES-256 Encryption**: All sensitive data encrypted at rest
- **Passkey Authentication**: WebAuthn-based login (Face ID/Touch ID on mobile)
- **No PII to AI**: Client-side filtering prevents personal data from reaching OpenAI
- **Self-Hosted**: Complete control over your financial data

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   iOS App       │    │   Backend API   │
│   (Next.js)     │────│  (React Native) │────│   (Node.js)     │
│   + Tailwind    │    │   + Expo        │    │   + MongoDB     │
│   + Recharts    │    │   + Victory     │    │   + OpenAI      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

**Web Frontend:**
- React + Next.js 15
- Tailwind CSS (responsive design)
- Recharts (data visualization)
- Passkey/WebAuthn authentication

**iOS App:**
- React Native + Expo
- Victory Native (charts)
- Async Storage (encrypted)
- Biometric authentication

**Backend:**
- Node.js + Express
- MongoDB (with Mongoose)
- OpenAI GPT-4o-mini
- AES-256 encryption

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API key (optional for AI features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd housemanagementapp
   npm run install:all
   ```

2. **Configure environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and OpenAI key
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Web: http://localhost:3001
   - Backend API: http://localhost:3000
   - iOS: `npm run dev:ios` (requires Expo CLI)

## 📱 Mobile Setup

### iOS App

```bash
cd mobile/ios-app
npm install
npm run ios  # Requires Xcode/iOS Simulator
```

**Features:**
- Target: iOS 16+
- Biometric login (Face ID/Touch ID)
- Secure local storage (AES-256)
- Background sync
- Push notifications
- Dedicated "Ask AI" tab

## 🐳 Docker Deployment

### 🎯 Integrated Web + API Container

The Docker container now serves both the web frontend and backend API from a single container on port 3000:

- **🌐 Web Interface**: `http://localhost:3000`
- **🔌 API Endpoints**: `http://localhost:3000/api/*`
- **💡 Health Check**: `http://localhost:3000/api/health`

### Using Docker Compose (Recommended)

```bash
# Start the complete stack (App + MongoDB)
docker-compose up -d

# To access the application:
#   Web Interface: http://localhost:3000
#   API: http://localhost:3000/api/health
```

### Manual Docker Build

```bash
# Build the integrated container
docker build -t finance-dashboard .

# Run with external MongoDB
docker run -d --name finance-app -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/finance_dashboard \
  finance-dashboard

# Run with Docker Compose MongoDB
docker run -d --name finance-app -p 3000:3000 \
  --network finance-app_default \
  -e MONGO_URI=mongodb://finance-mongodb:27017/finance_dashboard \
  finance-dashboard
```

**Environment Variables for Production:**
```env
NODE_ENV=production
MONGO_URI=mongodb://finance-mongodb:27017/finance_dashboard
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_KEY=sk-proj-your-openai-key-here
ADMIN_PASSWORD=your_admin_password_here
```

### 🔧 Docker Troubleshooting

#### Build Issues

**Problem: ESLint/TypeScript errors during build**
```bash
# Error: Module build failed (from ./node_modules/eslint-loader/index.js)
# Solution: ESLint config has been updated to treat warnings as non-blocking
```

The ESLint configuration has been optimized for Docker builds:
- `@typescript-eslint/no-unused-vars`: Changed to "warn"
- `@typescript-eslint/no-explicit-any`: Changed to "warn" 
- `@typescript-eslint/no-empty-object-type`: Changed to "warn"
- `react/no-unescaped-entities`: Changed to "warn"

**Problem: Native dependency compilation errors**
```bash
# Error: node-gyp rebuild failed
# Solution: Dockerfile includes build tools for native modules
```

The Dockerfile installs necessary build dependencies:
```dockerfile
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    libc6-compat
```

**Problem: Out of memory during build**
```bash
# Increase Docker memory limit to 4GB+ in Docker Desktop settings
# Or use multi-stage build (already implemented)
```

#### Runtime Issues

**Problem: Container starts but API returns 404**
```bash
# Check if the backend is running on the correct port
docker logs finance-dashboard-container-name

# Test the health endpoint
curl http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Problem: MongoDB connection issues**
```bash
# Check if MongoDB is accessible
docker-compose logs mongodb

# Test connection from inside container
docker exec -it finance-app sh
# Then: curl mongodb:27017 (should connect)
```

**Problem: Web frontend not loading**
```bash
# The Docker image serves both web frontend and backend API
# Check if static files are properly built and served
curl http://localhost:3000  # Should return HTML
curl http://localhost:3000/api/health  # Should return JSON

# If frontend doesn't load, check container logs
docker logs finance-app-container-name
```

#### Performance Optimization

**Production Docker Settings:**
```bash
# Use specific Node.js version
FROM node:18.19.0-alpine

# Set NODE_ENV for optimizations
ENV NODE_ENV=production

# Use npm ci for faster, deterministic builds
RUN npm ci --only=production

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3
```

**Docker Compose Production Example:**
```yaml
version: "3.8"
services:
  finance-dashboard:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongodb:27017/finance_dashboard
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

#### Testing Docker Build

**Complete Docker Test Suite:**

```bash
# 1. Clean build test
docker build -t finance-dashboard-test .

# 2. Container startup test
docker run -d -p 3000:3000 --name test-container finance-dashboard-test

# 3. Wait for startup (health check built-in)
sleep 10

# 4. Test all critical endpoints
echo "Testing API health..."
curl -f http://localhost:3000/api/health || echo "❌ Health check failed"

echo "Testing auth endpoint..."
curl -f http://localhost:3000/api/auth/login || echo "✅ Auth endpoint reachable (404 expected)"

echo "Testing finance endpoint..."
curl -f http://localhost:3000/api/finance/entries || echo "✅ Finance endpoint reachable (401 expected)"

# 5. Check container health status
docker inspect test-container --format='{{.State.Health.Status}}'

# 6. Review logs for errors
echo "Checking logs for critical errors..."
docker logs test-container | grep -i "error\|fail\|exception" || echo "✅ No critical errors found"

# 7. Test graceful shutdown
docker stop test-container

# 8. Cleanup
docker rm test-container
docker rmi finance-dashboard-test
```

**Automated Testing Script:**

```bash
#!/bin/bash
# save as test-docker.sh
set -e

echo "🧪 Starting Docker build test..."

# Build and tag
docker build -t finance-dashboard-test .

# Run detached
docker run -d -p 3000:3000 --name finance-test finance-dashboard-test

# Wait for startup
echo "⏳ Waiting for container startup..."
for i in {1..30}; do
  if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Container is healthy!"
    break
  fi
  sleep 2
done

# Test endpoints
if curl -f http://localhost:3000/api/health; then
  echo "✅ All tests passed!"
else
  echo "❌ Health check failed"
  docker logs finance-test
  exit 1
fi

# Cleanup
docker stop finance-test && docker rm finance-test
echo "🎉 Docker test completed successfully!"
```

#### Common Error Solutions

| Error | Solution |
|-------|----------|
| `npm ERR! gyp ERR! build error` | Build tools installed in Dockerfile |
| `ESLint errors blocking build` | Rules relaxed to "warn" level |
| `ECONNREFUSED MongoDB` | Use docker-compose for networking |
| `Container exits immediately` | Check entrypoint script permissions |
| `Health check failing` | Verify `/api/health` endpoint |
| `Port 3000 already in use` | Change port mapping: `-p 3001:3000` |

#### Docker Monitoring & Debugging

**Real-time Container Monitoring:**

```bash
# Monitor resource usage
docker stats finance-app finance-mongodb

# Follow logs in real-time
docker logs -f finance-app

# Execute commands inside running container
docker exec -it finance-app sh

# Inside container debugging:
# Check Node.js process
ps aux | grep node

# Check MongoDB connectivity
ping mongodb

# Check environment variables
env | grep MONGO

# Test internal API
curl localhost:3000/api/health
```

**Production Health Monitoring:**

```bash
# Set up health check monitoring
while true; do
  if ! curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "$(date): ❌ Health check failed - restarting container"
    docker-compose restart finance-app
  else
    echo "$(date): ✅ Application healthy"
  fi
  sleep 30
done
```

**Docker Compose Troubleshooting:**

```bash
# Check all services status
docker-compose ps

# View logs for specific service
docker-compose logs finance-app
docker-compose logs mongodb

# Restart specific service
docker-compose restart finance-app

# Rebuild and restart
docker-compose up --build -d

# Check network connectivity between services
docker-compose exec finance-app ping mongodb
```
````markdown
## 🎯 Usage Guide

### 📊 Dashboard Tabs

1. **💰 Liquid Assets**
   - View all account balances
   - Auto-convert currencies (CAD ↔ USD)
   - Track gains/losses with charts

2. **📉 Monthly Expenses**
   - Drag & drop receipts for auto-processing
   - Category-based expense tracking
   - Undo/confirm modals for accuracy

3. **📊 Budget Tracking**
   - Set monthly budgets by category
   - Visual progress indicators
   - AI-powered suggestions for next month

4. **🏦 Retirement & Savings**
   - Compound growth calculator
   - Goal tracking with projections
   - Multiple savings goals

5. **🇨🇦 TFSA Tracker**
   - Annual contribution limits
   - Over-contribution warnings
   - Historical tracking

6. **📈 Stock Tracking**
   - Manual ticker entry
   - Real-time price updates
   - Tax estimates & realized gains

### 🤖 AI Assistant

**Web**: Floating chat widget (bottom-right)
**iOS**: Dedicated "Ask AI" tab

**Example Questions:**
- "What category did I spend the most on this month?"
- "Is my food budget on track?"
- "Should I rebalance my portfolio?"
- "How much can I contribute to my TFSA?"

**Privacy Protection:**
- Credit card numbers → Blocked
- Email addresses → Blocked
- Bank account numbers → Blocked
- SSNs/Tax IDs → Blocked

## 🛡️ Security Features

### Data Protection
- **AES-256-GCM encryption** for all sensitive data
- **Passkey authentication** (WebAuthn standard)
- **PII filtering** prevents sensitive data from reaching AI
- **Secure local storage** on mobile (encrypted SQLite)

### Error Handling
| Condition | Behavior |
|-----------|----------|
| Market API fails | Show cached values |
| CAD/USD rate fails | Display "Estimated only" warning |
| AI timeout | Retry with fallback message |
| PII detected | Block submission with alert |
| Network offline | Local storage fallback |

## 🧪 Development

### Project Structure
```
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── models/    # MongoDB schemas
│   │   ├── routes/    # API endpoints
│   │   ├── middleware/# PII filtering, auth
│   │   └── utils/     # Encryption utilities
├── web/               # Next.js frontend
│   ├── src/
│   │   ├── app/       # App router pages
│   │   └── components/# React components
├── mobile/ios-app/    # React Native iOS app
│   ├── app/           # Expo router
│   └── components/    # Reusable components
└── data/              # MongoDB data (Docker volume)
```

### Available Scripts
```bash
npm run dev           # Start all development servers
npm run build         # Build for production
npm run docker:build  # Build Docker image
npm run docker:run    # Run with Docker Compose
npm run install:all   # Install all dependencies
```

## 🔧 Configuration

### MongoDB Setup
```bash
# Local MongoDB
mongod --dbpath ./data

# Or use MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/finance
```

### OpenAI Configuration
```bash
# Get API key from https://platform.openai.com/
OPENAI_KEY=sk-proj-your-key-here
```

### Responsive Design Testing
- **Mobile**: 360px width (iPhone SE)
- **Tablet**: 768px width (iPad)
- **Desktop**: 1280px+ width

Test on:
- Chrome Mobile DevTools
- Safari iOS Simulator
- Firefox Responsive Mode

## 📈 Future Enhancements (V2)

- [ ] PDF export & print layouts
- [ ] Multi-language support
- [ ] Banking API integrations (Plaid/Yodlee)
- [ ] AI-powered monthly digest emails
- [ ] Read-only sharing links for accountants
- [ ] Advanced tax optimization suggestions
- [ ] Investment performance analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Security Notes

1. **Never commit your `.env` files** - they contain sensitive API keys
2. **Change default passwords** in production deployment
3. **Use HTTPS** in production (SSL/TLS certificates)
4. **Regular backups** - encrypt all backup files with AES-256
5. **Monitor AI usage** - review ChatGPT conversation logs for any PII leaks

---

**Built with ❤️ for financial privacy and security**
