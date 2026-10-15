import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 百科全书文章集合：直接加载仓库 docs 目录（无 frontmatter，标题从正文 H1 提取）
const docs = defineCollection({
  loader: glob({ pattern: '[0-9][0-9]-*/**/*.md', base: '../docs' }),
  schema: z.object({
    title: z.string().optional(),
    order: z.number().optional(),
  }),
});

const exams = defineCollection({
  loader: glob({
    pattern: '[0-9][0-9]-*/*.md',
    base: '../exams',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({ title: z.string().optional() }),
});

export const collections = { docs, exams };
