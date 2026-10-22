import { parse } from 'yaml';

export interface BlogFrontmatter {
  title?: string;
  excerpt?: string;
  publishDate?: string;
  tags?: string[];
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return undefined;
}

function asFrontmatter(value: unknown): BlogFrontmatter {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const record = value as Record<string, unknown>;
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === 'string')
    : undefined;

  return {
    title: asString(record.title),
    excerpt: asString(record.excerpt),
    publishDate: asString(record.publishDate),
    tags,
  };
}

export function readFrontmatter(raw: string): {
  content: string;
  data: BlogFrontmatter;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (!match) {
    return { content: raw, data: {} };
  }

  return {
    content: raw.slice(match[0].length),
    data: asFrontmatter(parse(match[1])),
  };
}
