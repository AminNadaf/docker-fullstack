# docker-fullstack

A complete multistage Docker project with:

| Service | Image / Build | Port |
|---------|--------------|------|
| **UI** | React + Vite → Nginx (multistage) | `3000` |
| **API** | Node.js + Express (multistage) | internal `4000` |
| **DB** | PostgreSQL 16 | internal `5432` |
| **Mail** | Mailpit (SMTP + web UI) | `8025` (web) |

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

- App → http://localhost:3000
- Mail UI → http://localhost:8025

## Multistage build overview

### UI (`ui/Dockerfile`)
```
Stage 1 (builder) – node:20-alpine  →  npm ci + vite build
Stage 2 (runner)  – nginx:1.27-alpine  →  copy /dist, serve
```

### API (`api/Dockerfile`)
```
Stage 1 (deps)   – node:20-alpine  →  npm ci --omit=dev
Stage 2 (runner) – node:20-alpine  →  copy node_modules + src
```

## Project structure

```
docker-fullstack/
├── ui/
│   ├── src/          # React source
│   ├── nginx.conf    # Nginx proxy config
│   └── Dockerfile    # Multistage: build → nginx
├── api/
│   ├── src/          # Express source
│   └── Dockerfile    # Multistage: deps → runner
├── sql/
│   └── init.sql      # Schema + seed data
├── docker-compose.yml
└── .env.example
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | DB health check |
| GET | `/users` | List all users |
| POST | `/users` | Create user + send welcome email |
