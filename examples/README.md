# 代码示例

> 配合正文的动手实践代码，覆盖传统机器学习和深度学习的核心算法。

## 目录

| 文件 | 内容 | 依赖 |
|------|------|------|
| [linear_regression.py](python/linear_regression.py) | 线性回归（手写 + sklearn） | numpy, sklearn |
| [logistic_regression.py](python/logistic_regression.py) | 逻辑回归（手写梯度下降 + sklearn） | numpy, sklearn |
| [decision_tree.py](python/decision_tree.py) | 决策树（sklearn 可视化） | sklearn, matplotlib |
| [cnn_mnist.py](python/cnn_mnist.py) | CNN 手写数字识别 | PyTorch |

## 运行方式

```bash
# 安装依赖
pip install numpy scikit-learn matplotlib torch torchvision

# 运行示例
cd examples/python
python linear_regression.py
python logistic_regression.py
python decision_tree.py
python cnn_mnist.py
```

## 说明

- 所有代码都有详细中文注释，配合正文阅读
- 优先使用手写实现理解原理，再用库快速验证
- 建议结合"🧠 费曼自测"和测试卷一起使用

---

*最后更新：2026年10月3日*
