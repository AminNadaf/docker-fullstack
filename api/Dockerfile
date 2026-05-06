# ── Stage 1: install deps ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --silent

# ── Stage 2: production image ────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["node", "src/index.js"]
