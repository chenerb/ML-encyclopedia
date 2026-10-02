import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 百科全书文章集合：直接加载仓库 docs 目录（无 frontmatter，标题从正文 H1 提取）
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../docs' }),
  schema: z.object({
    title: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { docs };
