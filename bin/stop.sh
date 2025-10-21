#!/bin/bash
set -e

echo "Stopping containers docker..."
docker compose down
echo "✅ Docker containers stopped!"