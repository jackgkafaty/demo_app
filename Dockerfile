# Multi-stage build for the complete Personal Finance Dashboard

# Stage 1: Build web frontend
FROM node:18-alpine AS web-builder

# Install dependencies needed for native modules
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    libc6-compat

WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Stage 2: Production backend with web frontend
FROM node:18-alpine AS production

# Install curl for health checks and other necessary packages
RUN apk add --no-cache curl libc6-compat

# Create app directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

# Copy built web frontend
COPY --from=web-builder /app/web/.next ./web/.next
COPY --from=web-builder /app/web/public ./web/public
COPY --from=web-builder /app/web/package.json ./web/package.json

# Create data directory for MongoDB and backups
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
