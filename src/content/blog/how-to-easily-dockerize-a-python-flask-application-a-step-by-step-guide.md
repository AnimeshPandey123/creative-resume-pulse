---
title: 'How to Easily Dockerize a Python Flask Application: A Step-by-Step Guide'
excerpt: 'Containerize a Flask 3 app with Docker: Dockerfile, Gunicorn for production, docker-compose, and practical tips without unnecessary fluff.'
publishDate: '2024-10-08'
tags: [python, flask, docker, containerization]
---

# Dockerize a Python Flask application

Docker gives you a reproducible runtime for Flask apps—same image in dev, CI, and production. I've used this pattern for small APIs and internal tools where Kubernetes would be overkill.

## 1. Minimal Flask app

```python
# app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

## 2. Dependencies

```txt
# requirements.txt
Flask==3.1.0
gunicorn==23.0.0
```

Pin versions so builds stay reproducible.

## 3. Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Development: Flask dev server
CMD ["python", "app.py"]
```

Add a `.dockerignore`:

```
__pycache__
*.pyc
.env
.git
.venv
```

## 4. Build and run

```bash
docker build -t flask-app .
docker run -p 5000:5000 flask-app
```

Open `http://localhost:5000/health` to verify.

## 5. Production with Gunicorn

Flask's built-in server is single-threaded and not suitable for production. Switch the CMD:

```dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

For a slightly leaner image, use a multi-stage build that copies only installed packages and app code into a slim final layer.

## 6. Docker Compose

When your app needs a database or Redis:

```yaml
services:
  web:
    build: .
    ports:
      - '5000:5000'
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Run with `docker compose up --build`.

## Practical notes

- **Don't run as root**: add a non-root user in the Dockerfile for production images.
- **Secrets**: pass credentials via environment variables or Docker secrets, not baked into the image.
- **Health checks**: use the `/health` endpoint in your orchestrator's liveness probe.
- **Hot reload in dev**: mount source with `docker compose` and use Flask's debug mode only locally—never in production.

That's the core workflow: Dockerfile, pinned deps, Gunicorn for production, Compose when you need backing services.
