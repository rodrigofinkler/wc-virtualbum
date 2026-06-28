# Virtualbum

A FIFA World Cup 26 sticker collector app.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Quick start

```sh
docker compose up --build
```

This starts three services:

| Service  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:8000      |
| Database | `postgres://localhost:5432`|

### Seed the database

Once everything is running, seed it with WC26 sticker data:

```sh
docker compose exec backend python manage.py seed_wc26
```

## Manual setup (without Docker)

### Backend

```sh
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_wc26
python manage.py runserver
```

Requires a PostgreSQL instance — configure `DATABASE_URL` or set `POSTGRES_*` env vars in `backend/config/settings.py`.

### Frontend

```sh
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:8000`.
