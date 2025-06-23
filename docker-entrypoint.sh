#!/bin/sh
set -e

echo "🧾 Personal Finance Dashboard - Starting..."

# Wait for MongoDB to start (if external)
if [ -n "$MONGO_URI" ] && [[ "$MONGO_URI" != mongodb://localhost* ]]; then
  echo "Using external MongoDB: $MONGO_URI"
else
  echo "Note: For local MongoDB, please use external MongoDB service or docker-compose"
  echo "Setting MONGO_URI to use localhost connection"
  export MONGO_URI=${MONGO_URI:-mongodb://localhost:27017/finance_dashboard}
fi

# Prompt for Admin Master Password on first run
if [ ! -f /app/data/.initialized ]; then
  echo "🔐 First run detected. Setting up Admin Master Password..."
  echo "Please set your admin password via environment variable ADMIN_PASSWORD"
  echo "Initialized at $(date)" > /app/data/.initialized
fi

echo "🚀 Starting application..."
exec "$@"
