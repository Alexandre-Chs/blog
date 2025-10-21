#!/bin/bash
set -e

MODE=${1:-prod}

echo "💫 Starting containers docker in $MODE mode..."

if [ "$MODE" = "dev" ]; then
  echo "Starting docker in dev mode..."
  docker compose up -d db
  echo "Starting frontend..."
  pnpm run db:studio & 
  pnpm run dev
else
  docker compose up -d --build
fi

echo "✅ Docker containers up!"
