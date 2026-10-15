import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildArticleIndex, articlePath } from '../utils/paths';
import { CHAPTERS } from '../utils/chapters';
import { markdownToSearchText } from '../utils/search.mjs';

export const prerender = true;

export async function GET(): Promise<APIRoute['response']> {
  const entries = await getCollection('docs');
  const articles = buildArticleIndex(entries);

  const data = articles.map((a) => {
    const chapter = CHAPTERS.find((c) => c.slug === a.chapter);
    return {
      title: a.title,
      description: a.description,
      content: markdownToSearchText(a.entry.body ?? ''),
      chapter: chapter?.label ?? a.chapter,
      href: articlePath(a),
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
