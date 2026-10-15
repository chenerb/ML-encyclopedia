# 🖥️ 前端站点（Astro）

基于 [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) 构建的静态文档站点，参考 [AIInfraGuide](https://github.com/caomaolufei/AIInfraGuide) 的界面设计，为《机器学习到深度学习演变百科全书》提供在线阅读体验。

## ✨ 功能特性

- 📖 **自动加载正文**：通过 Astro Content Layer 直接读取 `docs/` 目录，无需给每篇文章添加 frontmatter（标题从 H1 自动提取）
- 🗂️ **章节导航侧边栏**：九大章节 + 第五章子分组，当前文章高亮，支持折叠
- 📑 **目录（TOC）**：右侧自动生成本页标题目录
- ⬅️➡️ **上一篇 / 下一篇**：按阅读顺序自动串联
- 🔍 **全文搜索**：覆盖 67 篇标题、简介与正文；多个关键词用空格分隔，标题优先，显示命中片段。`Ctrl/Cmd + K` 或 `/` 打开，方向键选择、Enter 打开，Esc 关闭并恢复焦点；加载失败可重试。
- 🌙 **深色模式**：跟随系统 + 手动切换，本地记忆
- 🧮 **数学公式**：KaTeX 渲染 `$...$` 与 `$$...$$`
- 📊 **图表**：Mermaid 流程图渲染
- 📋 **代码复制**：代码块一键复制按钮
- 📈 **阅读进度条 + 回到顶部**
- 📱 **响应式**：移动端抽屉菜单
- 📍 **继续学习**：记忆每篇正文的阅读位置，再次打开时可选择恢复或从头阅读；首页显示真实学习进度和下一课。
- ✅ **已学标记**：手动标记或撤销完成，滚动到底不会自动标记学会。记录仅保存在当前浏览器；禁用存储时仍可阅读。
- 🎯 **专注阅读**：一键收起两侧导航，目录随当前阅读位置高亮。
- 📝 **在线测验**：94 套试卷，题目与解析各自独立阅读；第五章扁平试卷可返回对应嵌套正文。
- 🔗 **站内链接**：构建时按 Markdown 源文件位置转换相对链接，保留 GitHub Pages base 与锚点。

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

# 逻辑测试（Node.js 20+）
npm test

# 在仓库根目录执行内容与生产链接检查（Python 3.9+，仅标准库）
cd ..
python3 -m unittest discover -s tests -v
python3 scripts/check_content.py
python3 scripts/check_site.py
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
        ├── search-index.json.ts    # 按需加载全文索引 JSON
        ├── exams/                 # 94 套试卷目录与188个题解页
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

部署前自动运行网站逻辑测试、内容检查和生产 HTML 链接检查。`node_modules/`、`dist/`、`.astro/` 为本地生成目录，由 `npm ci` 和构建重新生成，不纳入版本控制。

## 🔧 新增文章

只需在 `docs/` 对应章节目录下新建 `.md` 文件（文件名以 `01-`、`02-` 等数字前缀排序），无需任何配置，重新构建即自动出现在站点中。

> **提示**：文章标题取正文首个 `# 一级标题`，建议每篇文章都以 `# 标题` 开头。
