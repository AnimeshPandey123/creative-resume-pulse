---
title: 'Deploying a Next.js Application with Nginx and Docker: A Comprehensive Guide'
excerpt: "Deploy a static Next.js export with Docker and nginx. Covers next.config.ts output: 'export', multi-stage builds, and serving HTML from nginx instead of a Node server."
publishDate: '2024-11-11'
tags: [nextjs, docker, nginx, devops, deployment-scaling]
---

# Deploying a Next.js application with nginx and Docker

This site uses Next.js static export (`output: 'export'` in `next.config.ts`). That means `next build` produces plain HTML, CSS, and JS in an `out/` directory—no Node.js process required at runtime. nginx serves those files directly, which is simpler and cheaper than running a Node server behind a reverse proxy.

If your app uses server features (API routes, SSR, ISR), you need a Node runtime instead. This guide focuses on the static export path because it's what I run in production for portfolio and marketing sites.

## 1. Configure Next.js for static export

In `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;
```

Build locally to verify:

```bash
npm ci
npm run build
```

The `out/` directory contains your deployable site. With `trailingSlash: true`, routes like `/blog/` map to `out/blog/index.html`.

**Limitations of static export**: no `getServerSideProps`, no API routes, no middleware, no incremental static regeneration. Plan accordingly before choosing this path.

## 2. Multi-stage Dockerfile (static export)

This Dockerfile builds the app and copies static files into an nginx image—no Node at runtime.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build the image:

```bash
docker build -t nextjs-static .
```

## 3. nginx configuration for static files

Create `nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    # Immutable cache for Next.js hashed assets
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Static assets in /public
    location ~* \.(png|jpg|jpeg|gif|webp|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # SPA-style fallback for client-side routes
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

With `trailingSlash: true`, nginx resolves `/blog/` to `blog/index.html` via `try_files $uri/`. The fallback to `/index.html` covers any client-side-only routes.

For HTTPS, terminate TLS at nginx or at a load balancer (ALB, Cloudflare). A typical TLS block:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... same location blocks as above
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}
```

## 4. Docker Compose

A minimal compose file—no Node service, no unrelated backends:

```yaml
services:
  web:
    build: .
    container_name: nextjs-static
    ports:
      - '${HTTP_PORT:-8080}:80'
    restart: unless-stopped

  # Optional: nginx reverse proxy in front of multiple services
  proxy:
    image: nginx:1.27-alpine
    container_name: nginx-proxy
    ports:
      - '${NGINX_HTTP_PORT:-80}:80'
      - '${NGINX_HTTPS_PORT:-443}:443'
    volumes:
      - ./nginx/proxy.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    restart: unless-stopped
```

Start the stack:

```bash
docker compose up -d --build
```

Visit `http://localhost:8080` (or port 80 if using the proxy service).

## 5. When you need a Node server instead

If your Next.js app cannot use static export—because it relies on `getServerSideProps`, Route Handlers, or middleware—use a Node-based runner:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
```

Then configure nginx as a reverse proxy:

```nginx
location / {
    proxy_pass http://nextjs-app:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 6. Production checklist

- **Environment variables**: only `NEXT_PUBLIC_*` vars are inlined at build time for static export. Bake them into the build stage with `ARG`/`ENV` in Docker, or use a build-time `.env.production`.
- **Secrets**: never commit API keys. Pass build args via CI secrets.
- **Health checks**: for static nginx, `curl -f http://localhost/` is sufficient.
- **Logs**: mount `/var/log/nginx` or ship logs to your observability stack.
- **Image size**: the nginx-only final image is typically under 50 MB.

## Summary

For static Next.js sites, skip the Node runtime in production. Build to `out/`, copy into an nginx image, and serve files directly. Use Docker multi-stage builds to keep images small, and reserve the Node + reverse-proxy pattern for apps that genuinely need server-side rendering.
