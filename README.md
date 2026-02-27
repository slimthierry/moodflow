# MoodFlow

Mood and Mental Well-being Tracking Application.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (port 3400)
- **Backend**: FastAPI + PostgreSQL + Redis (port 64000)
- **Monorepo**: pnpm workspaces + Turborepo

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python 3.12+
- Docker & Docker Compose

### Development

```bash
# Start infrastructure
docker compose up -d db redis

# Install frontend dependencies
pnpm install

# Start frontend
pnpm dev:web

# Start backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 64000 --reload
```

### Docker (full stack)

```bash
docker compose up -d
```

## Project Structure

```
moodflow/
  backend/          # FastAPI Python backend
  apps/web/         # React + Vite frontend
  packages/
    types/          # Shared TypeScript types
    utils/          # Shared utilities
    ui/             # Shared UI components
    api-client/     # API client & React Query hooks
    theme/          # Theme system (light/dark)
```
