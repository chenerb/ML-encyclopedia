# CLAUDE.md - 机器学习到深度学习演变百科全书

本文档为 Claude Code (claude.ai/code) 提供指导，用于编写和维护“机器学习到深度学习演变百科全书”项目。本项目旨在创建一个通俗易懂、系统全面的机器学习与深度学习教程文档，涵盖从基础算法到前沿发展的完整知识体系。

## 项目概述

### 目标
- **系统梳理**：从传统机器学习到深度学习的完整发展脉络
- **通俗易懂**：用生活化的类比和直观解释降低学习门槛
- **全面覆盖**：涵盖基础算法、核心概念、关键模型和应用场景
- **持续更新**：跟踪最新技术发展，保持内容的前沿性

### 受众群体
- 机器学习初学者，希望系统掌握基础知识
- 有一定经验的开发者，希望深入理解算法原理
- 教育工作者，寻找教学参考资料
- 技术爱好者，了解人工智能发展历程

## 文档结构

```
ml-dl-encyclopedia/
├── README.md                    # 项目总览和快速入门
├── SUMMARY.md                   # 文档目录（用于GitBook等工具）
├── CONTRIBUTING.md              # 贡献指南
├── docs/
│   ├── 01-introduction/         # 引言部分
│   │   ├── 01-what-is-ml.md     # 什么是机器学习
│   │   ├── 02-ml-vs-dl.md       # 机器学习 vs 深度学习
│   │   └── 03-history-overview.md # 历史发展概述
│   ├── 02-mathematics/          # 数学基础
│   │   ├── 01-linear-algebra.md # 线性代数基础
│   │   ├── 02-probability.md    # 概率论基础
│   │   ├── 03-calculus.md       # 微积分基础
│   │   └── 04-optimization.md   # 优化理论
│   ├── 03-traditional-ml/       # 传统机器学习算法
│   │   ├── 01-linear-regression.md      # 线性回归
│   │   ├── 02-logistic-regression.md    # 逻辑回归
│   │   ├── 03-decision-trees.md         # 决策树
│   │   ├── 04-random-forest.md          # 随机森林
│   │   ├── 05-svm.md                    # 支持向量机
│   │   ├── 06-knn.md                    # K近邻算法
│   │   ├── 07-clustering.md             # 聚类算法
│   │   ├── 08-naive-bayes.md            # 朴素贝叶斯
│   │   └── 09-model-evaluation.md       # 模型评估方法
│   ├── 04-neural-networks/      # 神经网络基础
│   │   ├── 01-perceptron.md             # 感知机
│   │   ├── 02-mlp.md                    # 多层感知机
│   │   ├── 03-backpropagation.md        # 反向传播算法
│   │   ├── 04-gradient-descent.md       # 梯度下降
│   │   ├── 05-activation-functions.md   # 激活函数
│   │   ├── 06-regularization.md         # 正则化技术
│   │   └── 07-optimizers.md             # 优化器
│   ├── 05-deep-learning/        # 深度学习算法
│   │   ├── 01-cnn/                      # 卷积神经网络
│   │   │   ├── 01-introduction.md       # CNN简介
│   │   │   ├── 02-convolution-layer.md  # 卷积层
│   │   │   ├── 03-pooling-layer.md      # 池化层
│   │   │   └── 04-applications.md       # 应用场景
│   │   ├── 02-rnn/                      # 循环神经网络
│   │   │   ├── 01-introduction.md       # RNN简介
│   │   │   ├── 02-lstm.md               # LSTM网络
│   │   │   ├── 03-gru.md                # GRU网络
│   │   │   └── 04-applications.md       # 应用场景
│   │   ├── 03-transformer/              # Transformer架构
│   │   │   ├── 01-introduction.md       # Transformer简介
│   │   │   ├── 02-attention-mechanism.md # 注意力机制
│   │   │   ├── 03-encoder-decoder.md    # 编码器-解码器
│   │   │   └── 04-applications.md       # 应用场景
│   │   ├── 04-gan/                      # 生成对抗网络
│   │   │   ├── 01-introduction.md       # GAN简介
│   │   │   ├── 02-generator-discriminator.md # 生成器与判别器
│   │   │   └── 03-applications.md       # 应用场景
│   │   └── 05-autoencoders/             # 自编码器
│   │       ├── 01-introduction.md       # 自编码器简介
│   │       └── 02-variational-autoencoders.md # 变分自编码器
│   ├── 06-milestone-models/     # 里程碑模型
│   │   ├── 01-alexnet.md                # AlexNet (2012)
│   │   ├── 02-vggnet.md                 # VGGNet (2014)
│   │   ├── 03-googlenet.md              # GoogLeNet (2014)
│   │   ├── 04-resnet.md                 # ResNet (2015)
│   │   ├── 05-transformer.md            # Transformer (2017)
│   │   ├── 06-bert.md                   # BERT (2018)
│   │   ├── 07-gpt-series.md             # GPT系列 (2018-2023)
│   │   └── 08-diffusion-models.md       # 扩散模型 (2020-)
│   ├── 07-practical-guide/      # 实践指南
│   │   ├── 01-data-preprocessing.md     # 数据预处理
│   │   ├── 02-feature-engineering.md    # 特征工程
│   │   ├── 03-model-selection.md        # 模型选择
│   │   ├── 04-hyperparameter-tuning.md  # 超参数调优
│   │   ├── 05-training-strategies.md    # 训练策略
│   │   ├── 06-deployment.md             # 模型部署
│   │   └── 07-ethics-responsibility.md  # 伦理与责任
│   ├── 08-applications/         # 应用领域
│   │   ├── 01-computer-vision.md       # 计算机视觉
│   │   ├── 02-natural-language-processing.md # 自然语言处理
│   │   ├── 03-speech-recognition.md    # 语音识别
│   │   ├── 04-recommendation-systems.md # 推荐系统
│   │   ├── 05-autonomous-driving.md    # 自动驾驶
│   │   └── 06-healthcare.md            # 医疗健康
│   └── 09-resources/            # 学习资源
│       ├── 01-books.md                  # 推荐书籍
│       ├── 02-courses.md                # 在线课程
│       ├── 03-papers.md                 # 重要论文
│       ├── 04-datasets.md               # 常用数据集
│       ├── 05-tools-frameworks.md       # 工具和框架
│       └── 06-communities.md            # 社区和论坛
├── examples/                     # 代码示例（可选）
│   ├── python/
│   │   ├── linear_regression.py
│   │   ├── decision_tree.py
│   │   └── cnn_mnist.py
│   └── jupyter-notebooks/
│       ├── 01-linear-regression.ipynb
│       └── 02-cnn-basics.ipynb
├── images/                      # 图片资源
│   ├── diagrams/                # 原理图
│   └── screenshots/             # 效果截图
└── glossary/                    # 术语表
    ├── english-chinese.md       # 英汉术语对照
    └── index.md                 # 术语索引
```

## 写作规范

### 1. 内容质量要求
- **准确性**：所有技术内容必须准确无误，引用可靠来源
- **易懂性**：使用通俗易懂的语言，避免过度学术化
- **结构化**：每篇文章遵循“概述-原理-应用-总结”结构
- **一致性**：术语使用前后一致，符合行业标准

### 2. 格式规范
- **文件命名**：使用英文小写字母和连字符，如 `linear-regression.md`
- **标题层级**：使用 Markdown 的 `#` 表示标题层级，最多使用四级标题
- **代码块**：使用 ``` 标注代码块，并指定语言类型
- **图片引用**：所有图片放在 `images/` 目录下，使用相对路径引用
- **参考文献**：在文章末尾添加参考资料列表

### 3. 风格指南
- **语言风格**：亲切但不随意，专业但不晦涩
- **举例说明**：每个复杂概念至少提供一个生活化例子
- **可视化表达**：尽可能使用图表、流程图辅助说明
- **避免偏见**：客观介绍各种算法的优缺点，不偏袒特定技术

### 4. 特殊元素标记
```markdown
> **定义**：用于强调核心概念的定义
> 
> **示例**：用于展示具体的计算或应用示例
> 
> **注意**：用于提醒读者重要的注意事项
> 
> **提示**：用于提供实用的小技巧或建议
> 
> **警告**：用于指出常见的错误或陷阱
```

## 开发工作流

### 1. 内容创建流程
```mermaid
graph TD
    A[确定主题] --> B[调研资料]
    B --> C[撰写草稿]
    C --> D[添加示例]
    D --> E[制作图表]
    E --> F[同行评审]
    F --> G[修订完善]
    G --> H[发布更新]
```

### 2. 协作规范
- **分支策略**：每篇文章在独立分支开发，通过 Pull Request 合并
- **评审流程**：每篇文章至少经过一人评审
- **版本控制**：使用语义化版本号标记重大更新

### 3. 质量保证
- **技术审核**：确保技术内容的准确性
- **语言润色**：提高文章的可读性和流畅度
- **链接检查**：确保所有内部和外部链接有效
- **移动端适配**：确保在移动设备上阅读体验良好

## 技术工具

### 1. 文档工具
- **编辑工具**：VS Code、Typora、Obsidian
- **版本控制**：Git + GitHub/GitLab
- **构建工具**：MkDocs、GitBook、Docusaurus（可选）
- **图表工具**：Draw.io、Excalidraw、Mermaid

### 2. 质量检查工具
- **拼写检查**：Code Spell Checker
- **语法检查**：Grammarly（英文）、中文校对工具
- **链接检查**：markdown-link-check
- **格式检查**：Prettier、markdownlint

### 3. 自动化流程
- **CI/CD**：自动构建和部署文档网站
- **链接检查**：定期检查失效链接
- **内容更新**：定期审核和更新过时内容

## 贡献指南

### 1. 如何贡献
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-article`)
3. 提交更改 (`git commit -m 'Add some amazing article'`)
4. 推送到分支 (`git push origin feature/amazing-article`)
5. 开启 Pull Request

### 2. 贡献类型
- **新文章**：撰写新的教程文章
- **内容更新**：更新过时或错误的内容
- **翻译**：将文章翻译成其他语言
- **示例代码**：添加或改进代码示例
- **图表制作**：制作原理图或示意图
- **校对润色**：改进文章的语言表达

### 3. 文章模板
每篇文章应包含以下部分：
```
# 文章标题

## 概述
- 简要介绍该算法/概念
- 说明学习本篇文章的目的

## 历史背景
- 算法/概念的起源和发展
- 关键人物和时间节点

## 核心原理
- 算法的数学原理
- 关键公式和推导
- 核心思想解释

## 通俗解释
- 生活化的类比
- 直观的比喻
- 简单示例说明

## 算法步骤
1. 第一步
2. 第二步
3. ...

## 优缺点分析
### 优点
- 优点1
- 优点2

### 缺点
- 缺点1
- 缺点2

## 应用场景
- 适用场景1
- 适用场景2

## 实践建议
- 使用时的注意事项
- 常见问题和解决方案

## 总结
- 关键要点回顾
- 进一步学习方向

## 参考文献
1. [文献1](链接)
2. [文献2](链接)

## 相关链接
- [下一篇：相关主题](链接)
- [上一篇：前置知识](链接)
```

## 更新与维护

### 1. 定期审核
- **每月**：检查外部链接的有效性
- **每季度**：审核技术内容的时效性
- **每年**：全面评估文档结构和内容覆盖

### 2. 版本记录
使用语义化版本号记录重大更新：
- **主版本号**：文档结构重大调整
- **次版本号**：新增重要章节或算法
- **修订号**：内容修正和优化

### 3. 反馈机制
- **问题反馈**：通过 GitHub Issues 报告问题
- **内容建议**：通过 Discussions 提出改进建议
- **错误修正**：通过 Pull Request 直接修正错误

## 许可证

本项目内容采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/) 进行许可。

代码示例采用 MIT 许可证。

---

**最后更新**：2026年4月11日

**维护者**：机器学习到深度学习演变百科全书项目组

**项目状态**：活跃开发中

---

> **提示**：使用 Claude Code 时，可以通过 `cd "E:\cc"` 切换到本项目目录，然后使用 `claude` 命令获取针对本项目的具体指导。