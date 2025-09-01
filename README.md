# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/11f3d025-e4ba-478c-9c28-febd0336cb29

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/11f3d025-e4ba-478c-9c28-febd0336cb29) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/11f3d025-e4ba-478c-9c28-febd0336cb29) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Blog content workflow

The blog now stores long-form content in Markdown and metadata in JSON:

- Markdown files live under `src/content/blog/<slug>.md`
- Metadata lives in `src/data/blog-posts.json` (authors, tags, and post metadata)

### Adding a new post

1. Create a Markdown file: `src/content/blog/<your-slug>.md`
2. Add frontmatter (optional but recommended):

```md
---
title: "My Post Title"
excerpt: "One-liner summary of the post."
publishDate: "2025-01-01"
tags: [tag-one, tag-two]
---

Your Markdown content here...
```

3. Add a new entry in `src/data/blog-posts.json` under `posts` with metadata and a relative `contentPath`:

```json
{
  "id": "uuid-here",
  "title": "My Post Title",
  "slug": "my-post-title",
  "excerpt": "One-liner summary of the post.",
  "coverImage": "https://.../image.png",
  "publishDate": "2025-01-01",
  "readingTime": 7,
  "authorId": "1",
  "tagIds": ["9"],
  "contentPath": "src/content/blog/my-post-title.md"
}
```

Notes:
- Frontmatter values (title, excerpt, publishDate) override JSON if provided; tags/author continue to use JSON for accuracy.
- Paths are resolved securely and must remain inside `src/content/blog`.
- Full-text search uses title and excerpt; Markdown is loaded server-side for rendering.
