# 🖥️ 前端站点（Astro）

基于 [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) 构建的静态文档站点，参考 [AIInfraGuide](https://github.com/caomaolufei/AIInfraGuide) 的界面设计，为《机器学习到深度学习演变百科全书》提供在线阅读体验。

## ✨ 功能特性

- 📖 **自动加载正文**：通过 Astro Content Layer 直接读取 `docs/` 目录，无需给每篇文章添加 frontmatter（标题从 H1 自动提取）
- 🗂️ **章节导航侧边栏**：九大章节 + 第五章子分组，当前文章高亮，支持折叠
- 📑 **目录（TOC）**：右侧自动生成本页标题目录
- ⬅️➡️ **上一篇 / 下一篇**：按阅读顺序自动串联
- 🔍 **全文搜索**：标题 + 描述客户端搜索，快捷键 `Ctrl/Cmd + K`
- 🌙 **深色模式**：跟随系统 + 手动切换，本地记忆
- 🧮 **数学公式**：KaTeX 渲染 `$...$` 与 `$$...$$`
- 📊 **图表**：Mermaid 流程图渲染
- 📋 **代码复制**：代码块一键复制按钮
- 📈 **阅读进度条 + 回到顶部**
- 📱 **响应式**：移动端抽屉菜单

## 🚀 快速开始

```bash
cd web
npm install

# 开发模式（热更新）
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 📁 目录结构

```
web/
├── astro.config.mjs        # Astro 配置（base、插件、markdown）
├── tailwind.config.mjs     # Tailwind + typography 插件
├── package.json
├── public/                 # 静态资源（favicon、robots）
└── src/
    ├── content/config.ts   # 内容集合（glob 加载 ../docs）
    ├── utils/
    │   ├── chapters.ts     # 九大章节元数据
    │   └── paths.ts        # 标题提取、路径、文章索引构建
    ├── layouts/Layout.astro
    ├── components/         # CategoryCard / GuideSidebar / TOC / Search / ThemeToggle / CopyButton
    └── pages/
        ├── index.astro             # 首页
        ├── docs/[...slug].astro    # 章节落地页 + 文章页（动态路由）
        ├── search-index.json.ts    # 搜索索引 JSON
        └── 404.astro
```

## ⚙️ 部署到 GitHub Pages

仓库根目录已内置 `.github/workflows/deploy.yml`，使用官方 `actions/deploy-pages` 方案：**推送 main 分支即自动构建并发布**。

首次使用只需一次性设置：

1. 推送代码到 GitHub：`git add -A && git commit -m "feat: add web site" && git push`
2. 打开仓库 **Settings → Pages**
3. 将 **Source** 改为 **GitHub Actions**（不是 Deploy from a branch）
4. 等待 Actions 运行完成，访问 **https://chenerb.github.io/ML-encyclopedia/**

之后每次 `git push` 都会自动重新部署。在仓库 **Actions** 标签页可查看构建状态与发布的 URL。

## 🔧 新增文章

只需在 `docs/` 对应章节目录下新建 `.md` 文件（文件名以 `01-`、`02-` 等数字前缀排序），无需任何配置，重新构建即自动出现在站点中。

> **提示**：文章标题取正文首个 `# 一级标题`，建议每篇文章都以 `# 标题` 开头。
