#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const MARKER = path.join(process.cwd(), '.cursor/hooks/.source-edited');

function runCheck(command) {
  try {
    execSync(command, {
      stdio: 'pipe',
      encoding: 'utf8',
      cwd: process.cwd(),
    });
    return null;
  } catch (error) {
    const stdout = error.stdout?.trim() ?? '';
    const stderr = error.stderr?.trim() ?? '';
    return [stdout, stderr].filter(Boolean).join('\n') || error.message;
  }
}

if (!fs.existsSync('package.json') || !fs.existsSync(MARKER)) {
  process.exit(0);
}

fs.unlinkSync(MARKER);

const errors = [];

const lintOutput = runCheck('npm run lint');
if (lintOutput) {
  errors.push(`## ESLint\n${lintOutput}`);
}

const tscOutput = runCheck('npx tsc --noEmit');
if (tscOutput) {
  errors.push(`## TypeScript\n${tscOutput}`);
}

if (errors.length === 0) {
  process.exit(0);
}

const followupMessage = [
  'Post-change verification failed. Fix all lint and TypeScript errors before finishing.',
  '',
  'Run:',
  'npm run lint',
  'npx tsc --noEmit',
  '',
  ...errors,
].join('\n');

console.log(JSON.stringify({ followup_message: followupMessage }));
process.exit(0);
