import { existsSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPOSITORY = 'https://github.com/chenerb/ML-encyclopedia';
const CHAPTER = /^0[1-9]-[a-z-]+$/;
const EXAM_FILE = /^(.+)-(题目|答案解析)$/;

function deploymentBase(base = '/') {
  return base === '/' ? '' : `/${String(base).replace(/^\/+|\/+$/g, '')}`;
}

function sitePath(route, base) {
  const prefix = deploymentBase(base);
  let pathname = route.startsWith('/') ? route : `/${route}`;
  if (prefix) {
    while (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      pathname = pathname.slice(prefix.length) || '/';
    }
  }
  return `${prefix}${pathname}`;
}

function encodedPath(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}

function isInside(root, filename) {
  const relative = path.relative(root, filename);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function isConfined(root, filename) {
  if (!isInside(root, filename)) return false;
  // Check the nearest existing parent too, so a symlink cannot escape the repo.
  let existing = filename;
  while (!existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) return false;
    existing = parent;
  }
  return isInside(realpathSync(root), realpathSync(existing));
}

/** Build an encoded exam URL from a collection ID that retains its original filename. */
export function examPath(id, base = '/') {
  const clean = String(id).replace(/\.md$/i, '');
  const parts = clean.split('/');
  if (parts.length !== 2 || !CHAPTER.test(parts[0]) || !EXAM_FILE.test(parts[1]) || parts.some((p) => p.includes('\\') || p.includes('\0'))) {
    return undefined;
  }
  return sitePath(`/exams/${encodedPath(clean)}/`, base);
}

/** Recover a lesson ID from the flattened exam naming used by the fifth chapter. */
export function examToArticleId(id) {
  const parts = String(id).replace(/\.md$/i, '').split('/');
  if (parts.length !== 2 || !CHAPTER.test(parts[0])) return undefined;
  const match = parts[1].match(EXAM_FILE);
  if (!match || !/^\d{2}-/.test(match[1])) return undefined;
  if (parts[0] === '05-deep-learning') {
    const nested = match[1].match(/^(01-cnn|02-rnn|03-transformer|04-gan|05-autoencoders)-(\d{2}-.+)$/);
    return nested ? `${parts[0]}/${nested[1]}/${nested[2]}` : undefined;
  }
  return `${parts[0]}/${match[1]}`;
}

/**
 * Resolve a Markdown href from its source file, rather than from the browser URL.
 * Undefined means the local target is unsafe and its href should be removed.
 */
export function resolveContentLink(href, sourcePath, options = {}) {
  if (typeof href !== 'string' || !href || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(href)) return href;
  if (!sourcePath || !options.repoRoot) return href;

  const root = path.resolve(options.repoRoot);
  const source = String(sourcePath).startsWith('file:')
    ? fileURLToPath(sourcePath)
    : path.resolve(root, String(sourcePath));
  if (!isConfined(root, source)) return undefined;

  const suffixAt = href.search(/[?#]/);
  const rawPath = suffixAt < 0 ? href : href.slice(0, suffixAt);
  const suffix = suffixAt < 0 ? '' : href.slice(suffixAt);
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    return undefined;
  }
  if (decoded.includes('\0') || decoded.includes('\\')) return undefined;

  const prefix = deploymentBase(options.base);
  let repositoryPath = decoded;
  if (prefix) {
    while (repositoryPath === prefix || repositoryPath.startsWith(`${prefix}/`)) {
      repositoryPath = repositoryPath.slice(prefix.length) || '/';
    }
  }

  // Already-generated web routes remain idempotent when a plugin runs twice.
  if (repositoryPath.startsWith('/') && !/\.md$/i.test(repositoryPath)) {
    const normalized = path.posix.normalize(repositoryPath);
    if (/^\/(?:docs|exams)(?:\/|$)/.test(normalized)) {
      const route = normalized === repositoryPath ? rawPath : encodedPath(normalized);
      return sitePath(route, options.base) + suffix;
    }
    if (repositoryPath === '/') return sitePath('/', options.base) + suffix;
  }

  const target = repositoryPath.startsWith('/')
    ? path.resolve(root, `.${repositoryPath}`)
    : path.resolve(path.dirname(source), repositoryPath);
  if (!isConfined(root, target)) return undefined;

  const relative = path.relative(root, target).split(path.sep).join('/');
  const parts = relative.split('/');
  const markdown = /\.md$/i.test(relative);
  if (markdown && parts[0] === 'docs' && CHAPTER.test(parts[1] ?? '') && parts.length >= 3) {
    return sitePath(`/docs/${encodedPath(parts.slice(1).join('/').replace(/\.md$/i, ''))}/`, options.base) + suffix;
  }
  if (relative === 'exams/README.md' || relative === 'exams') {
    return sitePath('/exams/', options.base) + suffix;
  }
  if (markdown && parts[0] === 'exams') {
    const route = examPath(parts.slice(1).join('/'), options.base);
    if (route) return route + suffix;
  }
  const isDirectory = rawPath.endsWith('/') || (existsSync(target) && statSync(target).isDirectory());
  const githubPath = encodedPath(relative) + (isDirectory && rawPath.endsWith('/') ? '/' : '');
  return `${REPOSITORY}/${isDirectory ? 'tree' : 'blob'}/main/${githubPath}${suffix}`;
}
