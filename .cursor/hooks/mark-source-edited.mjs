#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const MARKER = path.join(process.cwd(), '.cursor/hooks/.source-edited');
const SOURCE_FILE =
  /\.(ts|tsx|js|jsx|mjs|cjs|css|json|mdc)$|eslint\.config\.mjs$/;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function getEditedFilePath(payload) {
  const candidates = [
    payload.file_path,
    payload.path,
    payload.filePath,
    payload.file,
  ].filter(Boolean);

  return candidates.find(
    candidate =>
      typeof candidate === 'string' &&
      !candidate.includes('node_modules') &&
      SOURCE_FILE.test(candidate)
  );
}

try {
  const input = await readStdin();
  const payload = input ? JSON.parse(input) : {};
  const editedFile = getEditedFilePath(payload);

  if (editedFile) {
    fs.mkdirSync(path.dirname(MARKER), { recursive: true });
    fs.writeFileSync(MARKER, editedFile);
  }
} catch {
  // Fail open: never block edits because of marker issues.
}

process.exit(0);
