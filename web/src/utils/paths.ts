import type { CollectionEntry } from 'astro:content';

/** 处理 base path 前缀 */
export function getPath(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (base === '/') return path;
  return `${base.replace(/\/$/, '')}${path}`;
}

/** 从 markdown 正文提取首个 H1 标题 */
export function extractTitle(body: string): string {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '未命名';
}

/** 提取正文首个段落作为描述（跳过标题、引用、代码块） */
export function extractDescription(body: string): string {
  const lines = body.split('\n');
  let inCode = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const text = line.trim();
    if (!text) continue;
    if (text.startsWith('#')) continue;
    if (text.startsWith('>')) continue;
    if (text.startsWith('|')) continue;
    if (/^[-*_]/.test(text) && text.length < 40) continue;
    const cleaned = text.replace(/[#>*`[\]]/g, '').trim();
    if (cleaned.length > 20) return cleaned.slice(0, 120) + (cleaned.length > 120 ? '…' : '');
  }
  return '';
}

/** 估算阅读时间（中文字符约 350/分钟，英文单词约 220/分钟） */
export function estimateReadingTime(body: string): { minutes: number; chars: number } {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`|\-]/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (text.match(/[a-zA-Z0-9]+/g) || []).length;
  const minutes = Math.max(1, Math.ceil(cjk / 350 + words / 220));
  return { minutes, chars: cjk + words };
}

export interface ArticleMeta {
  /** collection id，如 03-traditional-ml/01-linear-regression */
  id: string;
  /** 章节 slug */
  chapter: string;
  /** 子分组 slug（第五章才有） */
  group?: string;
  /** 文件名，如 01-linear-regression */
  slug: string;
  title: string;
  description: string;
  /** 预计阅读时间（分钟） */
  readingTime: number;
  entry: CollectionEntry<'docs'>;
}

/** 从 collection id 解析章节/分组/文件名 */
export function parseArticleId(id: string): { chapter: string; group?: string; slug: string } {
  const parts = id.split('/');
  if (parts.length === 3) {
    return { chapter: parts[0], group: parts[1], slug: parts[2].replace(/\.md$/, '') };
  }
  return { chapter: parts[0], slug: parts[1].replace(/\.md$/, '') };
}

/** 构建文章元数据列表（按文件名自然排序） */
export function buildArticleIndex(
  entries: CollectionEntry<'docs'>[],
): ArticleMeta[] {
  return entries
    .filter((e) => !e.id.endsWith('/index') && !e.id.includes('SUMMARY'))
    .map((entry) => {
      const { chapter, group, slug } = parseArticleId(entry.id);
      const body = entry.body ?? '';
      const reading = estimateReadingTime(body);
      return {
        id: entry.id,
        chapter,
        group,
        slug,
        title: extractTitle(body),
        description: extractDescription(body),
        readingTime: reading.minutes,
        entry,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id, 'zh-CN'));
}

/** 文章访问路径 */
export function articlePath(article: ArticleMeta): string {
  return getPath(`/docs/${article.id.replace(/\.md$/, '')}`);
}
