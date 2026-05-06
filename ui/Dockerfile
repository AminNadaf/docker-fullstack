# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --silent
COPY . .
RUN npm run build

# ── Stage 2: serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.28-alpine AS runner
RUN apk upgrade --no-cache
COPY --from=builder /app/dist /usr/share/nginx/html
# Proxy /api to the API service
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
