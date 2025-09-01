---
title: "Deploying a Next.js Application with Nginx and Docker: A Comprehensive Guide"
excerpt: "Deploy Next.js in production using Docker and Nginx with best practices."
publishDate: "2024-11-11"
tags: [nextjs, docker, nginx, devops]
---

## Deploying a Next.js Application with Nginx and Docker: A Comprehensive Guide

Deploying a Next.js application in production is a straightforward process, especially when using Docker and Nginx. This combination streamlines the setup while enhancing scalability and performance.

This guide will cover the following steps:

- Setting up the Next.js app for production
- Building a Docker image for the app
- Configuring Nginx as a reverse proxy for Next.js
- Deploying Docker containers for production

Let's dive in!

## 1. Preparing the Next.js Application for Production

Before deploying your Next.js app, ensure it's optimized for production.

- Environment Variables: Define necessary environment variables, such as **NEXT_PUBLIC_API_URL**, in your **.env** file. Ensure these are referenced correctly within your app.
- **Build the Application**: In the root of your Next.js project, run the following commands:

```bash
npm install
npm run build
```

This will generate a production-ready version of your Next.js application in the **.next** directory.

- **Static Optimization**: If your Next.js app has pages that don't require server-side rendering, consider static generation. This will make your app faster by delivering pre-rendered HTML files to the client.

## 2. Building a Docker Image for Next.js

Docker is a powerful tool for packaging and deploying your application across any environment. Here's how to create a Docker image for your Next.js app.

### Dockerfile Setup

In the root of your Next.js project, create a Dockerfile with the following content:

```dockerfile
# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies based on the lock file
COPY package.json package-lock.json .//
RUN npm ci

# Copy all files to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the application using a smaller base image
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Only copy the built app and necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json .//
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js server in production mode
CMD ["npm", "run", "start"]
```

### Building the Docker Image

With the Dockerfile ready, build the Docker image by running:

```bash
docker build -t nextjs-app .
```

This command will create a Docker image named nextjs-app with all the necessary dependencies and a built version of your Next.js application.

## 3. Configuring Nginx as a Reverse Proxy for Next.js

Using Nginx as a reverse proxy offers security and scalability benefits. We'll configure Nginx to serve the Next.js app on port 80.

### Setting up the Nginx Configuration File

Create a file named nginx.conf with the following content:

```nginx
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

# Next.js landing page configuration
server {
    listen 443 ssl;
    server_name yourdomain.com;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Caching settings
    location / {
        proxy_pass http://landing:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache landing_cache;
        proxy_cache_valid 200 1h;  # Cache successful responses for 1 hour
        proxy_cache_use_stale error timeout updating;  # Serve stale cache on error
        add_header X-Cache-Status $upstream_cache_status;  # Debugging header
    }

    # Handle Next.js optimized images
    location /_next/image {
        proxy_pass http://landing:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Handle other Next.js static assets
    location /_next/static {
        proxy_pass http://landing:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1y;
        add_header Cache-Control "public";
        add_header 'Access-Control-Allow-Origin' '*';
    }
}
```

This configuration directs all traffic from port 80 to your Next.js app running on port 3000.

### Docker Compose Setup for Nginx and Next.js

Using Docker Compose simplifies managing multiple Docker containers. Create a docker-compose.yml file as follows:

```yaml
version: "3.8"

services:
  # Next.js landing app
  landing:
    build: .
    container_name: nextjs-landing
    ports:
      - "${NEXTJS_PORT:-9000}:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    depends_on:
      - drupal
    networks:
      - portfolio-network

  # Nginx reverse proxy
  nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "${NGINX_HTTP_PORT:-80}:80"
      - "${NGINX_HTTPS_PORT:-443}:443"
    volumes:
      - ./nginx:/etc/nginx/conf.d
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - drupal
      - landing
    networks:
      - portfolio-network

volumes:
  db_datav2:

networks:
  portfolio-network:
    driver: bridge
```

This setup:

- Builds the Next.js app in a container
- Configures Nginx as a reverse proxy on port 80
- Maps port 80 on the host to port 80 in the Nginx container

### Running Docker Compose

To start the containers, run:

```bash
docker-compose up -d
```

This command will start both the **nextjs_app** and nginx_proxy containers in detached mode. You should be able to access your application by visiting https://yourdomain.com.

## 4. Deploying Docker Containers for Production

Once you have verified that the Dockerized Next.js application works as expected, it's time to prepare it for production.

### Steps to Harden the Deployment

1. **Use Docker Secrets for Sensitive Information**: For production, avoid storing sensitive information in plain text files. Use Docker secrets or environment variables management solutions.
2. **Configure Nginx Caching and Compression**: Nginx can significantly improve response times by caching assets and compressing files.
3. **SSL/TLS Configuration**: Set up an SSL certificate using Let's Encrypt for HTTPS. Update the **nginx.conf** file to listen on port 443 and use the certificate files.
4. **Docker Compose Production Deployment**: Use separate Compose files for development and production. For instance, **docker-compose.prod.yml** might include specific settings, such as mounting log directories or including load balancer configurations.

## Wrapping Up

In this guide, we've covered the essentials of deploying a Next.js application with Docker and Nginx. Here's a recap of the steps:

1. Prepare your Next.js app for production with a Dockerfile.
2. Set up an Nginx reverse proxy to serve your app.
3. Deploy the app using Docker Compose.

This setup provides a scalable, efficient, and flexible approach for deploying and managing a Next.js application in production. Happy coding and deploying!

