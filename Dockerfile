# ========================================
# Stage 1: Build
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate && pnpm i --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# ========================================
# Stage 2: Production dependencies only
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate && pnpm i --frozen-lockfile --prod

# ========================================
# Stage 3: Runner
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 blog

# Copy only what's needed
COPY --from=builder --chown=blog:nodejs /app/.output ./.output
COPY --from=deps --chown=blog:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=blog:nodejs /app/package.json ./package.json

# Security: Run as non-root user
USER blog

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
