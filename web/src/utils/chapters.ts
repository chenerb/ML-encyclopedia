// 章节元数据：与 docs/ 目录一一对应
export interface ChapterGroup {
  /** 子目录名，如 01-cnn */
  slug: string;
  /** 显示名，如 卷积神经网络（CNN） */
  label: string;
}

export interface Chapter {
  /** 目录名，如 03-traditional-ml */
  slug: string;
  /** 完整标题，如 第三章：传统机器学习 */
  label: string;
  /** 短标题，用于导航/卡片 */
  shortLabel: string;
  /** 简介 */
  description: string;
  /** emoji 图标 */
  icon: string;
  /** 主题渐变色 */
  gradient: { from: string; to: string; glow: string };
  /** 子分组（仅第五章深度学习有） */
  groups?: ChapterGroup[];
}

export const CHAPTERS: Chapter[] = [
  {
    slug: '01-introduction',
    label: '第一章：引言',
    shortLabel: '引言',
    description: '机器学习的定义、与深度学习的关系，以及人工智能的历史发展脉络。',
    icon: '🌱',
    gradient: { from: '#3B82F6', to: '#06B6D4', glow: 'rgba(59,130,246,0.15)' },
  },
  {
    slug: '02-mathematics',
    label: '第二章：数学基础',
    shortLabel: '数学基础',
    description: '线性代数、概率论、微积分与优化理论——读懂算法前必须打好的数学地基。',
    icon: '📐',
    gradient: { from: '#06B6D4', to: '#10B981', glow: 'rgba(6,182,212,0.15)' },
  },
  {
    slug: '03-traditional-ml',
    label: '第三章：传统机器学习',
    shortLabel: '传统机器学习',
    description: '线性回归、决策树、SVM、KNN、聚类、朴素贝叶斯等经典算法与模型评估。',
    icon: '🌳',
    gradient: { from: '#10B981', to: '#84CC16', glow: 'rgba(16,185,129,0.15)' },
  },
  {
    slug: '04-neural-networks',
    label: '第四章：神经网络基础',
    shortLabel: '神经网络基础',
    description: '从感知机到多层感知机，反向传播、梯度下降、激活函数与正则化。',
    icon: '🧠',
    gradient: { from: '#F59E0B', to: '#EF4444', glow: 'rgba(245,158,11,0.15)' },
  },
  {
    slug: '05-deep-learning',
    label: '第五章：深度学习',
    shortLabel: '深度学习',
    description: 'CNN、RNN、Transformer、GAN 与自编码器——深度学习五大核心模型家族。',
    icon: '🚀',
    gradient: { from: '#8B5CF6', to: '#EC4899', glow: 'rgba(139,92,246,0.15)' },
    groups: [
      { slug: '01-cnn', label: '卷积神经网络（CNN）' },
      { slug: '02-rnn', label: '循环神经网络（RNN）' },
      { slug: '03-transformer', label: 'Transformer 架构' },
      { slug: '04-gan', label: '生成对抗网络（GAN）' },
      { slug: '05-autoencoders', label: '自编码器' },
    ],
  },
  {
    slug: '06-milestone-models',
    label: '第六章：里程碑模型',
    shortLabel: '里程碑模型',
    description: 'AlexNet、ResNet、Transformer、BERT、GPT 系列到扩散模型的辉煌之路。',
    icon: '🏆',
    gradient: { from: '#6366F1', to: '#8B5CF6', glow: 'rgba(99,102,241,0.15)' },
  },
  {
    slug: '07-practical-guide',
    label: '第七章：实践指南',
    shortLabel: '实践指南',
    description: '数据预处理、特征工程、模型选择、调优、训练策略与部署的完整落地流程。',
    icon: '🛠️',
    gradient: { from: '#F97316', to: '#F59E0B', glow: 'rgba(249,115,22,0.15)' },
  },
  {
    slug: '08-applications',
    label: '第八章：应用领域',
    shortLabel: '应用领域',
    description: '计算机视觉、自然语言处理、语音识别、推荐系统、自动驾驶与医疗健康。',
    icon: '🌍',
    gradient: { from: '#EC4899', to: '#F43F5E', glow: 'rgba(236,72,153,0.15)' },
  },
  {
    slug: '09-resources',
    label: '第九章：学习资源',
    shortLabel: '学习资源',
    description: '推荐书籍、在线课程、经典论文、常用数据集、工具框架与社区论坛。',
    icon: '📚',
    gradient: { from: '#0EA5E9', to: '#6366F1', glow: 'rgba(14,165,233,0.15)' },
  },
];

export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function getGroupLabel(chapterSlug: string, groupSlug: string): string {
  const chapter = getChapter(chapterSlug);
  return chapter?.groups?.find((g) => g.slug === groupSlug)?.label ?? groupSlug;
}
