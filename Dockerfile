# 1️⃣ Étape : build
FROM node:20-alpine AS builder
WORKDIR /app

# Installer PNPM et dépendances
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm i --frozen-lockfile

# Copier le reste du projet et build
COPY . .
RUN pnpm run build

# 2️⃣ Étape : runtime léger
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copier seulement ce qui est nécessaire pour l’exécution
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exposer le port par défaut de TanStack Start
EXPOSE 3000

# Commande de démarrage
CMD ["node", ".output/server/index.mjs"]
