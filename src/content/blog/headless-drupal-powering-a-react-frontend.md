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

JSON:API has shipped with Drupal core since 8.7. It is not enabled by the Standard profile, and `drupal/recommended-project` does not install Drush. Drupal 11 needs PHP 8.3 or newer. The same Drush 13 commands work on Drupal 10 when PHP is 8.3+.

`drush site:install -y` with no database URL crashes in Drush 13 in a non-interactive shell. Pass a SQLite URL. The driver stores the path relative to the Drupal root (`web/`). `sqlite://sites/default/files/.ht.sqlite` is parsed as host `sites` and file `default/files/.ht.sqlite`, which lands outside `sites/default` and inside the docroot. Use the `localhost` form the SQLite driver generates:

```bash
composer create-project drupal/recommended-project:^11 my-headless-site
cd my-headless-site
composer require drush/drush:^13
vendor/bin/drush site:install standard \
  --db-url=sqlite://localhost/sites/default/files/.ht.sqlite \
  --account-name=admin \
  --account-pass=admin \
  -y
vendor/bin/drush en jsonapi -y
```

For Drupal 10, change the first command to `composer create-project drupal/recommended-project:^10 my-headless-site`. The account password above is for a local site. Run Drush as `vendor/bin/drush` from the project root. The web root is `web/`, not the project root.

Serve it locally with the PHP built-in server:

```bash
php -S localhost:8888 -t web
```

That server ignores `.htaccess`. Use Apache or nginx, pointed at `web/`, before you expose the site.

Verify the discovery document. A successful `GET /jsonapi` is `application/vnd.api+json` even without an `Accept` header. Send the header anyway: the JSON:API spec requires it, and it is the media type you should branch on.

```bash
curl -s -H 'Accept: application/vnd.api+json' \
  http://localhost:8888/jsonapi | jq .
```

### Article content type

On Drupal 10 and on Drupal 11.3 and earlier, `site:install standard` already creates an **Article** type with `title`, `body` (text with summary), and `field_image`. Creating a second type named Article fails because the machine name `article` is taken.

On Drupal 11.4 and later, Standard does not install Article. Apply the core recipe. The path is relative to the Drupal root:

```bash
vendor/bin/drush recipe core/recipes/article_content_type -y
```

That recipe adds the same `body` and `field_image` fields. Publish a node and fill the body summary. JSON:API exposes the bundle at:

```
GET /jsonapi/node/article
GET /jsonapi/node/article/{uuid}
```

### Query with filters and includes

JSON:API supports sparse fieldsets, filtering, sorting, and relationship includes. This collection query returns published articles, newest first, with the image file inlined:

```bash
curl -g -s -H 'Accept: application/vnd.api+json' \
  'http://localhost:8888/jsonapi/node/article?filter[status]=1&sort=-created&page[limit]=10&include=field_image' \
  | jq .
```

`curl` treats `[` as a glob unless you pass `-g`. A real response looks like this (abbreviated; `links` and extra attributes omitted):

```json
{
  "data": [
    {
      "type": "node--article",
      "id": "ba25b2d0-2fbe-495d-8fe9-a9fffcb9ff00",
      "attributes": {
        "title": "Getting started with headless Drupal",
        "body": {
          "value": "<p>Content here</p>",
          "format": "basic_html",
          "processed": "<p>Content here</p>",
          "summary": "A short summary"
        },
        "created": "2026-09-23T22:22:25+00:00",
        "path": {
          "alias": "/getting-started-headless-drupal",
          "pid": 1,
          "langcode": "en"
        }
      },
      "relationships": {
        "field_image": {
          "data": {
            "type": "file--file",
            "id": "cb14f44e-90c1-4fe8-9c07-6235c46e8231",
            "meta": { "alt": "Hero" }
          }
        }
      }
    }
  ],
  "included": [
    {
      "type": "file--file",
      "id": "cb14f44e-90c1-4fe8-9c07-6235c46e8231",
      "attributes": {
        "uri": {
          "value": "public://2025-09/hero.png",
          "url": "/sites/default/files/2025-09/hero.png"
        }
      }
    }
  ]
}
```

`body.value` is the stored source. `body.processed` is the text-format output. `body.summary` is the summary entered on the body field, or an empty string when that box is blank. `field_image` is a single-value image field, so `relationships.field_image.data` is one resource identifier, not an array. The included file's `uri.url` is root-relative.

## CORS for cross-origin React apps

When React runs on `localhost:3000` or another origin, the browser blocks the response unless Drupal sends `Access-Control-Allow-Origin`. CORS is already in core (`Asm89\Stack\Cors` via the `cors.config` container parameter). Do not install `drupal/cors`. The 8.x package on Drupal.org requires `drupal/core ~8.0` and will not resolve against Drupal 10 or 11.

`web/sites/default/settings.php` already loads `services.yml` from the same directory. Copy the default file and set `cors.config`, then rebuild the container. Editing `default.services.yml` has no effect.

```bash
cp web/sites/default/default.services.yml web/sites/default/services.yml
```

Replace the `cors.config` block in `web/sites/default/services.yml`:

```yaml
parameters:
  cors.config:
    enabled: true
    allowedHeaders: ['accept', 'authorization', 'content-type', 'x-csrf-token']
    allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE']
    allowedOrigins: ['http://localhost:3000', 'https://your-react-app.com']
    allowedOriginsPatterns: []
    exposedHeaders: false
    maxAge: false
    supportsCredentials: false
```

```bash
vendor/bin/drush cr
```

A `GET` from `http://localhost:3000` then returns `Access-Control-Allow-Origin: http://localhost:3000`. An origin that is not in the list does not. `Accept: application/vnd.api+json` is not a CORS-safelisted header value, so the browser sends a preflight; the header list above allows it. Keep `supportsCredentials` false unless you are using cookies. You cannot combine credentialed requests with `allowedOrigins: ['*']`.

For local development you can also proxy `/jsonapi` through the React dev server and skip CORS.

## Fetching articles in React

Use `fetch`. `data` holds the articles. `included` holds the files from `include=field_image`. In the Next.js App Router this component is a client component because it uses state and an effect. `NEXT_PUBLIC_DRUPAL_URL` must be the origin (`http://localhost:8888`) with no path and no trailing slash. `uri.url` already includes any subdirectory base path.

```tsx
'use client';

import { useEffect, useState } from 'react';

const DRUPAL_BASE = process.env.NEXT_PUBLIC_DRUPAL_URL;

type ResourceIdentifier = {
  type: string;
  id: string;
  meta?: { alt?: string | null };
};

type JsonApiResource = {
  type: string;
  id: string;
  attributes?: {
    title?: string;
    body?: { summary?: string };
    uri?: { url?: string };
  };
  relationships?: {
    field_image?: {
      data?: ResourceIdentifier | ResourceIdentifier[] | null;
    };
  };
};

type JsonApiCollection = {
  data: JsonApiResource[];
  included?: JsonApiResource[];
};

type Article = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  imageAlt: string;
};

function absoluteDrupalUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  const base = (DRUPAL_BASE ?? '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function resolveImageUrl(
  included: JsonApiResource[],
  relationship?: { data?: ResourceIdentifier | ResourceIdentifier[] | null }
): { url: string; alt: string } | null {
  const data = relationship?.data;
  const ref = Array.isArray(data) ? data[0] : data;
  if (!ref || !DRUPAL_BASE) {
    return null;
  }
  const file = included.find(
    item => item.type === 'file--file' && item.id === ref.id
  );
  const url = file?.attributes?.uri?.url;
  if (!url) {
    return null;
  }
  return {
    url: absoluteDrupalUrl(url),
    alt: ref.meta?.alt ?? '',
  };
}

function parseArticles(json: JsonApiCollection): Article[] {
  const included = json.included ?? [];
  return json.data.map(node => {
    const image = resolveImageUrl(included, node.relationships?.field_image);
    return {
      id: node.id,
      title: node.attributes?.title ?? '',
      summary: node.attributes?.body?.summary ?? '',
      imageUrl: image?.url ?? null,
      imageAlt: image?.alt ?? '',
    };
  });
}

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!DRUPAL_BASE) {
      setError('Set NEXT_PUBLIC_DRUPAL_URL to your Drupal origin.');
      return;
    }

    const url =
      `${DRUPAL_BASE.replace(/\/$/, '')}/jsonapi/node/article` +
      '?filter[status]=1&sort=-created&page[limit]=10&include=field_image';

    fetch(url, {
      headers: { Accept: 'application/vnd.api+json' },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json() as Promise<JsonApiCollection>;
      })
      .then(json => setArticles(parseArticles(json)))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
      });
  }, []);

  if (error) {
    return <p>Failed to load articles: {error}</p>;
  }

  return (
    <ul>
      {articles.map(article => (
        <li key={article.id}>
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.imageAlt} width={120} />
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

- `include=field_image` inlines the file entity and avoids a second request per article.
- `attributes.uri.url` is root-relative (`/sites/default/files/...`). Prefix the Drupal origin.
- For image-style derivatives, the `consumer_image_styles` module (Drupal 9.5, 10, and 11) can emit styled URLs once a consumer is configured.

## Authentication basics

Published content is available to anonymous `GET` requests. JSON:API is read-only by default. `POST`, `PATCH`, and `DELETE` return `405` with `Allow: GET` until an administrator enables writes at `/admin/config/services/jsonapi`.

**Basic auth** (development only) is a core module:

```bash
vendor/bin/drush en basic_auth -y
```

```tsx
fetch(url, {
  headers: {
    Accept: 'application/vnd.api+json',
    Authorization: `Basic ${btoa('user:pass')}`,
  },
});
```

The authenticated account still needs permission to view the node. Unpublished content is hidden from anonymous users even if you filter `status` to `0`.

**OAuth 2** (production): `simple_oauth` 6.x supports Drupal 10.3 and 11. Installing it also enables the `consumers` module. Generating keys does not create a token. Point the key path outside `web/` so the private key is not under the docroot, then set those paths and create a consumer in the Simple OAuth settings.

```bash
composer require drupal/simple_oauth
vendor/bin/drush en simple_oauth -y
mkdir -p oauth-keys
vendor/bin/drush simple-oauth:generate-keys "$PWD/oauth-keys" -y
```

Prefer a backend-for-frontend or httpOnly cookies over storing access tokens in `localStorage`.

## When to add a custom module

Most projects don't need custom endpoints. Prefer JSON:API filters and includes, or the `jsonapi_extras` module to rename fields and control output. Core does not expose Views displays as JSON:API collections.

Reach for a custom module when you need aggregated data across entity types, computed fields that are not base fields, or a BFF-style endpoint that reduces round trips for a specific React view.

## Common pitfalls

- **Caching**: Standard enables Internal Page Cache and Dynamic Page Cache, and anonymous JSON:API `GET`s are stored (`X-Drupal-Cache: HIT` on a repeat request). The default performance setting still sends `Cache-Control: must-revalidate, no-cache, private`, so a CDN will not store them until you raise the page cache maximum age under Configuration, Development, Performance.
- **Draft content**: Unpublished nodes require an authenticated request from an account that can view them.
- **HTML in body fields**: Render `body.processed`. `body.value` is the raw stored source and bypasses the text format. Sanitize again on the client when the format can contain risky markup.
- **Path aliases**: The resource id is the UUID. With the Path module enabled, the alias is `attributes.path.alias`. Filtering the collection with `filter[path.alias]` returns HTTP 500 (`'path' not found`) because `path` is computed. Read the alias from each resource, or resolve incoming paths with a dedicated router module instead of a JSON:API filter.

## Summary

Headless Drupal with React is a proven split: Drupal owns the content model and editorial experience; React owns the UI. JSON:API gives you the Article entities once the module and the content type are actually installed. Configure core CORS in `services.yml`, resolve images from `included`, and turn on OAuth only after writes or private content need a token.
