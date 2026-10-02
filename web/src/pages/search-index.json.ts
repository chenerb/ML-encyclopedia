import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildArticleIndex, articlePath, extractTitle, extractDescription } from '../utils/paths';
import { CHAPTERS } from '../utils/chapters';

export const prerender = true;

export async function GET(): Promise<APIRoute['response']> {
  const entries = await getCollection('docs');
  const articles = buildArticleIndex(entries);

  const data = articles.map((a) => {
    const chapter = CHAPTERS.find((c) => c.slug === a.chapter);
    return {
      title: a.title,
      description: a.description,
      chapter: chapter?.label ?? a.chapter,
      href: articlePath(a),
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
