---
title: 'Headless Drupal powering a React frontend'
excerpt: 'Use Drupal 10/11 as a headless CMS with JSON:API, then fetch content in React. Covers CORS, auth, images, and real entity queries—not hardcoded arrays.'
publishDate: '2025-09-21'
tags: ['drupal', 'react', 'headless-cms', 'api-development', 'web-development']
---

# Headless Drupal powering a React frontend

I've shipped several decoupled Drupal backends feeding React frontends. The pattern works well when editorial teams need Drupal's content model and workflows, while the product team wants a modern JS stack on the client.

This guide covers a practical setup: Drupal 10 or 11 as the content API, JSON:API for reads, and a React app that consumes real entity data—not placeholder arrays.

## Why decouple Drupal from React?

Drupal excels at structured content, permissions, revisions, and editorial workflows. React excels at interactive UIs. Decoupling lets each layer do what it's good at:

- **Content editors** work in Drupal's admin UI.
- **Frontend developers** ship React without fighting Drupal's theme layer.
- **API consumers** can reuse the same endpoints for mobile apps or other clients.

## Drupal 10/11 setup

### Install and enable JSON:API

JSON:API ships with Drupal core (8.7+). On a fresh Drupal 10/11 site:

```bash
composer create-project drupal/recommended-project my-headless-site
cd my-headless-site
drush site:install -y
drush en jsonapi -y
```

Verify the discovery endpoint:

```bash
curl -s https://your-drupal-site.com/jsonapi | jq .
```

### Create a content type

In the admin UI, create an **Article** content type with fields such as:

- `title` (core)
- `body` (formatted text)
- `field_image` (image)
- `field_summary` (plain text, optional)

Publish a few test nodes. JSON:API exposes them at:

```
GET /jsonapi/node/article
GET /jsonapi/node/article/{uuid}
```

### Query with filters and includes

JSON:API supports sparse fieldsets, filtering, sorting, and relationship includes:

```
/jsonapi/node/article?filter[status]=1&sort=-created&page[limit]=10&include=field_image
```

A real response looks like this (abbreviated):

```json
{
  "data": [
    {
      "type": "node--article",
      "id": "9caafd9f-...",
      "attributes": {
        "title": "Getting started with headless Drupal",
        "body": { "value": "<p>Content here</p>", "format": "basic_html" },
        "created": "2025-09-21T10:00:00+00:00"
      },
      "relationships": {
        "field_image": {
          "data": { "type": "file--file", "id": "file-uuid-here" }
        }
      }
    }
  ],
  "included": [
    {
      "type": "file--file",
      "id": "file-uuid-here",
      "attributes": {
        "uri": { "url": "/sites/default/files/2025-09/hero.jpg" }
      }
    }
  ]
}
```

## CORS for cross-origin React apps

When React runs on `localhost:3000` or a separate domain, the browser blocks API calls unless Drupal allows the origin.

Install and configure the CORS module:

```bash
composer require drupal/cors
drush en cors -y
```

In `services.yml` (or via the module's settings), allow your frontend origin:

```yaml
parameters:
  cors.config:
    enabled: true
    allowedHeaders: ['*']
    allowedMethods: ['GET', 'POST', 'OPTIONS']
    allowedOrigins: ['http://localhost:3000', 'https://your-react-app.com']
    supportsCredentials: false
```

For local development, you can also proxy API requests through your React dev server to avoid CORS entirely.

## Fetching articles in React

Use the native `fetch` API or Axios. Parse the JSON:API envelope—`data` holds resources, `included` holds related entities:

```tsx
import { useEffect, useState } from 'react';

const DRUPAL_BASE = process.env.NEXT_PUBLIC_DRUPAL_URL;

type Article = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
};

function resolveImageUrl(included: any[], relationship: any): string | null {
  if (!relationship?.data) return null;
  const file = included?.find(
    item => item.type === 'file--file' && item.id === relationship.data.id
  );
  if (!file?.attributes?.uri?.url) return null;
  return `${DRUPAL_BASE}${file.attributes.uri.url}`;
}

function parseArticles(json: any): Article[] {
  const included = json.included ?? [];
  return json.data.map((node: any) => ({
    id: node.id,
    title: node.attributes.title,
    summary: node.attributes.field_summary ?? '',
    imageUrl: resolveImageUrl(included, node.relationships?.field_image),
  }));
}

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url =
      `${DRUPAL_BASE}/jsonapi/node/article` +
      '?filter[status]=1&sort=-created&include=field_image';

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => setArticles(parseArticles(json)))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>Failed to load articles: {error}</p>;

  return (
    <ul>
      {articles.map(article => (
        <li key={article.id}>
          {article.imageUrl && (
            <img src={article.imageUrl} alt="" width={120} />
          )}
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </li>
      ))}
    </ul>
  );
}
```

### Image handling tips

- Use `include=field_image` (or nested includes for image styles) to avoid N+1 requests.
- Drupal file URLs are relative (`/sites/default/files/...`); prepend your Drupal base URL.
- For responsive images, consider the `consumer_image_styles` module or a custom JSON:API normalizer that emits absolute URLs and styled derivatives.

## Authentication basics

Public content works with anonymous `GET` requests. For protected content or write operations:

**Basic auth** (development only):

```bash
drush en basic_auth -y
```

```tsx
fetch(url, {
  headers: {
    Authorization: `Basic ${btoa('user:pass')}`,
  },
});
```

**OAuth 2** (production): use the `simple_oauth` module for token-based access. React stores the access token (prefer httpOnly cookies or a secure backend-for-frontend rather than localStorage for sensitive apps).

```bash
composer require drupal/simple_oauth
drush en simple_oauth -y
```

Configure a consumer in Drupal, then exchange credentials for a bearer token your React app sends on each request.

## When to add a custom module

Most projects don't need custom endpoints. Prefer JSON:API filters, views exposed via REST/JSON:API, or the `jsonapi_extras` module to rename fields and control output.

Reach for a custom module when you need aggregated data across entity types, computed fields not exposed by default, or a BFF-style endpoint that reduces round trips for a specific React view.

## Common pitfalls

- **Caching**: Drupal's dynamic page cache does not apply the same way to JSON:API. Use HTTP cache headers or a CDN in front of read-heavy endpoints.
- **Draft content**: Unpublished nodes require authenticated requests with appropriate permissions.
- **HTML in body fields**: Sanitize rendered HTML on the client or use a restricted text format in Drupal.
- **Path aliases**: JSON:API uses UUIDs, not URL aliases. Store or map aliases separately if your React router needs them.

## Summary

Headless Drupal with React is a proven split: Drupal owns the content model and editorial experience; React owns the UI. JSON:API gives you real entity data out of the box—configure CORS, handle images via `included` resources, and add OAuth when you need authenticated access.
