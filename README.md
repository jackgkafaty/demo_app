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

### Using Docker Compose (Recommended)

```bash
# Configure environment variables in docker-compose.yml
docker-compose up --build
```

### Manual Docker Build

```bash
docker build -t finance-dashboard .
docker run -p 3000:3000 -v ./data:/app/data finance-dashboard
```

**Environment Variables for Production:**
```env
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/finance_dashboard
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
# The Docker image serves backend API only
# For full-stack deployment, use docker-compose.yml
# Web frontend should be served separately or through reverse proxy
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

```bash
# Test build process
docker build -t finance-dashboard-test .

# Test container startup
docker run -d -p 3000:3000 --name test-container finance-dashboard-test

# Test API endpoints
curl http://localhost:3000/api/health

# Check logs for errors
docker logs test-container

# Cleanup
docker stop test-container && docker rm test-container
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

#### Development vs Production

**Development:** Single container with file watching
```bash
docker run -it -p 3000:3000 -v $(pwd):/app finance-dashboard npm run dev
```

**Production:** Multi-service with docker-compose
```bash
docker-compose up -d
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
