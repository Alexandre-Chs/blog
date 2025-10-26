#!/bin/bash
set -e

echo "Running database migrations..."

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
else
  echo "❌ .env not found"
  exit 1
fi

export DATABASE_URL="$DATABASE_URL_PROD"

pnpm drizzle-kit generate --config drizzle.config.ts
pnpm drizzle-kit migrate --config drizzle.config.ts

echo "✅ Migration completed successfully!"