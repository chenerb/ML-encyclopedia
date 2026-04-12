# 机器学习到深度学习演变百科全书

> 一本系统全面、通俗易懂的机器学习与深度学习教程文档

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Status: Active](https://img.shields.io/badge/Status-Active-green.svg)]()

---

## 📖 项目简介

本项目旨在系统梳理从传统机器学习到现代深度学习的完整知识体系，帮助读者：

- **理解历史脉络**：从感知机到大语言模型，了解人工智能的演变历程
- **掌握核心原理**：深入理解算法背后的数学原理和直觉
- **学以致用**：通过丰富的示例和实践指南，将理论应用于实际项目

---

## 🗺️ 知识地图

```
机器学习基础
├── 数学工具（线性代数、概率论、微积分）
├── 传统算法（线性回归、决策树、SVM...）
└── 模型评估（交叉验证、混淆矩阵...）
         ↓
神经网络
├── 感知机与多层感知机
├── 反向传播与梯度下降
└── 激活函数与正则化
         ↓
深度学习
├── CNN（图像识别）
├── RNN/LSTM/GRU（序列数据）
├── Transformer（自然语言处理）
├── GAN（生成模型）
└── 自编码器（表示学习）
         ↓
里程碑模型
├── AlexNet → ResNet（视觉革命）
├── BERT → GPT（语言模型崛起）
└── 扩散模型（生成式AI）
```

---

## 📚 文档目录

### 第一章：引言
- [什么是机器学习](docs/01-introduction/01-what-is-ml.md)
- [机器学习 vs 深度学习](docs/01-introduction/02-ml-vs-dl.md)
- [历史发展概述](docs/01-introduction/03-history-overview.md)

### 第二章：数学基础
- [线性代数基础](docs/02-mathematics/01-linear-algebra.md)
- [概率论基础](docs/02-mathematics/02-probability.md)
- [微积分基础](docs/02-mathematics/03-calculus.md)
- [优化理论](docs/02-mathematics/04-optimization.md)

### 第三章：传统机器学习
- [线性回归](docs/03-traditional-ml/01-linear-regression.md)
- [逻辑回归](docs/03-traditional-ml/02-logistic-regression.md)
- [决策树](docs/03-traditional-ml/03-decision-trees.md)
- [随机森林](docs/03-traditional-ml/04-random-forest.md)
- [支持向量机](docs/03-traditional-ml/05-svm.md)
- [K近邻算法](docs/03-traditional-ml/06-knn.md)
- [聚类算法](docs/03-traditional-ml/07-clustering.md)
- [朴素贝叶斯](docs/03-traditional-ml/08-naive-bayes.md)
- [模型评估方法](docs/03-traditional-ml/09-model-evaluation.md)

### 第四章：神经网络基础
- [感知机](docs/04-neural-networks/01-perceptron.md)
- [多层感知机](docs/04-neural-networks/02-mlp.md)
- [反向传播算法](docs/04-neural-networks/03-backpropagation.md)
- [梯度下降](docs/04-neural-networks/04-gradient-descent.md)
- [激活函数](docs/04-neural-networks/05-activation-functions.md)
- [正则化技术](docs/04-neural-networks/06-regularization.md)
- [优化器](docs/04-neural-networks/07-optimizers.md)

### 第五章：深度学习
#### 卷积神经网络（CNN）
- [CNN简介](docs/05-deep-learning/01-cnn/01-introduction.md)
- [卷积层](docs/05-deep-learning/01-cnn/02-convolution-layer.md)
- [池化层](docs/05-deep-learning/01-cnn/03-pooling-layer.md)
- [CNN应用场景](docs/05-deep-learning/01-cnn/04-applications.md)

#### 循环神经网络（RNN）
- [RNN简介](docs/05-deep-learning/02-rnn/01-introduction.md)
- [LSTM网络](docs/05-deep-learning/02-rnn/02-lstm.md)
- [GRU网络](docs/05-deep-learning/02-rnn/03-gru.md)
- [RNN应用场景](docs/05-deep-learning/02-rnn/04-applications.md)

#### Transformer架构
- [Transformer简介](docs/05-deep-learning/03-transformer/01-introduction.md)
- [注意力机制](docs/05-deep-learning/03-transformer/02-attention-mechanism.md)
- [编码器-解码器](docs/05-deep-learning/03-transformer/03-encoder-decoder.md)
- [Transformer应用](docs/05-deep-learning/03-transformer/04-applications.md)

#### 生成对抗网络（GAN）
- [GAN简介](docs/05-deep-learning/04-gan/01-introduction.md)
- [生成器与判别器](docs/05-deep-learning/04-gan/02-generator-discriminator.md)
- [GAN应用场景](docs/05-deep-learning/04-gan/03-applications.md)

#### 自编码器
- [自编码器简介](docs/05-deep-learning/05-autoencoders/01-introduction.md)
- [变分自编码器](docs/05-deep-learning/05-autoencoders/02-variational-autoencoders.md)

### 第六章：里程碑模型
- [AlexNet (2012)](docs/06-milestone-models/01-alexnet.md)
- [VGGNet (2014)](docs/06-milestone-models/02-vggnet.md)
- [GoogLeNet (2014)](docs/06-milestone-models/03-googlenet.md)
- [ResNet (2015)](docs/06-milestone-models/04-resnet.md)
- [Transformer (2017)](docs/06-milestone-models/05-transformer.md)
- [BERT (2018)](docs/06-milestone-models/06-bert.md)
- [GPT系列 (2018-2023)](docs/06-milestone-models/07-gpt-series.md)
- [扩散模型 (2020-)](docs/06-milestone-models/08-diffusion-models.md)

### 第七章：实践指南
- [数据预处理](docs/07-practical-guide/01-data-preprocessing.md)
- [特征工程](docs/07-practical-guide/02-feature-engineering.md)
- [模型选择](docs/07-practical-guide/03-model-selection.md)
- [超参数调优](docs/07-practical-guide/04-hyperparameter-tuning.md)
- [训练策略](docs/07-practical-guide/05-training-strategies.md)
- [模型部署](docs/07-practical-guide/06-deployment.md)
- [伦理与责任](docs/07-practical-guide/07-ethics-responsibility.md)

### 第八章：应用领域
- [计算机视觉](docs/08-applications/01-computer-vision.md)
- [自然语言处理](docs/08-applications/02-natural-language-processing.md)
- [语音识别](docs/08-applications/03-speech-recognition.md)
- [推荐系统](docs/08-applications/04-recommendation-systems.md)
- [自动驾驶](docs/08-applications/05-autonomous-driving.md)
- [医疗健康](docs/08-applications/06-healthcare.md)

### 第九章：学习资源
- [推荐书籍](docs/09-resources/01-books.md)
- [在线课程](docs/09-resources/02-courses.md)
- [重要论文](docs/09-resources/03-papers.md)
- [常用数据集](docs/09-resources/04-datasets.md)
- [工具和框架](docs/09-resources/05-tools-frameworks.md)
- [社区和论坛](docs/09-resources/06-communities.md)

### 附录
- [英汉术语对照表](glossary/english-chinese.md)
- [术语索引](glossary/index.md)

---

## 🚀 快速开始

**如果你是完全的初学者：**
1. 从[什么是机器学习](docs/01-introduction/01-what-is-ml.md)开始
2. 了解[历史发展概述](docs/01-introduction/03-history-overview.md)
3. 学习[数学基础](docs/02-mathematics/01-linear-algebra.md)
4. 按顺序学习传统机器学习算法

**如果你有一定编程基础：**
1. 跳过数学基础，直接从[线性回归](docs/03-traditional-ml/01-linear-regression.md)开始
2. 完成传统ML部分后，进入[神经网络基础](docs/04-neural-networks/01-perceptron.md)
3. 重点学习[反向传播](docs/04-neural-networks/03-backpropagation.md)和[梯度下降](docs/04-neural-networks/04-gradient-descent.md)

**如果你想直接学习深度学习：**
1. 确保理解[多层感知机](docs/04-neural-networks/02-mlp.md)的基础
2. 直接进入[CNN](docs/05-deep-learning/01-cnn/01-introduction.md)或[Transformer](docs/05-deep-learning/03-transformer/01-introduction.md)

---

## 🤝 贡献指南

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与本项目。

贡献类型：
- 📝 撰写新文章
- 🔧 修正技术错误
- 🌐 翻译文章
- 💡 添加代码示例
- 🎨 制作图表

---

## 📄 许可证

- 文档内容：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- 代码示例：[MIT License](LICENSE)

---

**最后更新**：2026年4月11日 | **维护者**：机器学习到深度学习演变百科全书项目组
