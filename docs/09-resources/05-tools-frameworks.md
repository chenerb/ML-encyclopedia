# 工具和框架：AI 工程师的"兵器谱"

## 概述

工欲善其事，必先利其器。这里整理了机器学习与深度学习的主流工具和框架，从数据处理到模型训练、部署，覆盖完整工作流。

---

## 🧮 深度学习框架

| 框架 | 特点 | 适用 |
|------|------|------|
| **PyTorch** | 动态图、易调试、研究首选 | 学术、研究、主流选择 |
| **TensorFlow** | 生态完整、生产部署强 | 工业界、移动端 |
| **JAX** | 函数式、高性能 | 大模型研究 |

> **建议**：新手直接学 **PyTorch**，社区最活跃、资料最多。

---

## 📊 传统机器学习库

| 库 | 用途 |
|------|------|
| **scikit-learn** | 传统 ML 全家桶（回归、分类、聚类、评估）|
| **XGBoost / LightGBM** | 表格数据竞赛王者 |
| **NumPy / SciPy** | 数值计算基础 |
| **pandas** | 数据处理、分析 |

---

## 📝 数据处理与可视化

| 库 | 用途 |
|------|------|
| **pandas** | 表格数据操作 |
| **matplotlib / seaborn** | 可视化 |
| **OpenCV** | 图像处理 |
| **NLTK / spaCy** | 文本处理 |

---

## 🚀 大模型工具

| 工具 | 用途 |
|------|------|
| **Hugging Face Transformers** | 预训练模型库，一站式微调 |
| **LangChain** | 大模型应用开发框架 |
| **vLLM** | 大模型高效推理 |
| **LoRA / PEFT** | 高效微调 |

---

## 🏗️ 部署与工程（MLOps）

| 工具 | 用途 |
|------|------|
| **ONNX** | 模型格式转换、跨框架 |
| **TensorRT** | GPU 推理加速 |
| **Docker** | 环境容器化 |
| **MLflow** | 实验跟踪、模型管理 |
| **Kubernetes** | 服务编排 |

---

## 🛠️ 开发环境

- **Jupyter Notebook / Lab**：交互式实验
- **VS Code + 插件**：日常开发
- **Google Colab**：免费 GPU 云端环境（新手友好）
- **Kaggle Notebook**：竞赛 + 数据 + GPU 一体

---

## 学习路径建议

1. **入门**：Python + NumPy + pandas + scikit-learn + Jupyter
2. **深度学习**：PyTorch（主力）+ Colab（免费 GPU）
3. **进阶**：Hugging Face + 大模型工具
4. **工程**：Docker + MLflow + ONNX/TensorRT

---

## 相关链接

- [上一篇：常用数据集](04-datasets.md)
- [下一篇：社区和论坛](06-communities.md)
