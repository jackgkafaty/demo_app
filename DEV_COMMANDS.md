# 🚀 Development Commands Quick Reference

## Single Command to Start Everything

```bash
npm run dev
```

This command starts both the backend and frontend simultaneously:
- **Backend**: http://localhost:3000 (Node.js + Express + MongoDB + OpenAI)
- **Frontend**: http://localhost:3001 (Next.js + React + Tailwind CSS)

## Individual Commands

### Start Backend Only
```bash
npm run dev:backend
```
- Starts the Node.js backend on port 3000
- Uses nodemon for auto-restart on file changes
- Includes MongoDB connection and OpenAI integration

### Start Frontend Only
```bash
npm run dev:web
```
- Starts the Next.js frontend on port 3001
- Uses Turbopack for faster builds
- Includes hot reload for development

### Start All Services (including iOS)
```bash
npm run dev:all
```
- Starts backend, frontend, and iOS app
- Good for full-stack mobile development

## Production Commands

### Build for Production
```bash
npm run build
```

### Start in Production Mode
```bash
npm start
```

## Installation Commands

### Install All Dependencies
```bash
npm run install:all
```
- Installs dependencies for root, backend, web, and mobile

## Service Status

When running `npm run dev`, you should see:
- ✅ **Backend**: OpenAI initialized, MongoDB connected, Server running on port 3000
- ✅ **Frontend**: Next.js ready, Local: http://localhost:3001

## Notes

- The commands use `concurrently` to run multiple services
- Output is color-coded: **BACKEND** (blue), **FRONTEND** (magenta)
- Both services support hot reload for development
- Use `Ctrl+C` to stop all services

## Troubleshooting

If you see errors:
1. Make sure MongoDB is running locally
2. Check that your OpenAI API key is set in `backend/.env`
3. Ensure all dependencies are installed with `npm run install:all`
4. Check that ports 3000 and 3001 are available

Happy coding! 🎉
