"""
逻辑回归示例：手写梯度下降 + sklearn 对比

对应正文：《逻辑回归：名为"回归"，实为"分类"》
"""

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

# ============ 1. 生成二分类数据 ============
np.random.seed(42)
n = 200
# 两类数据：类 0 分布在左下，类 1 分布在右上
X0 = np.random.randn(n // 2, 2) * 0.8 + np.array([-2, -2])
X1 = np.random.randn(n // 2, 2) * 0.8 + np.array([2, 2])
X = np.vstack([X0, X1])
y = np.hstack([np.zeros(n // 2), np.ones(n // 2)])

# ============ 2. 手写逻辑回归（梯度下降）============
def sigmoid(z):
    """Sigmoid 函数：把任意实数压到 (0,1)"""
    return 1 / (1 + np.exp(-z))

def logistic_regression(X, y, lr=0.1, epochs=1000):
    """逻辑回归：线性打分 + sigmoid + 交叉熵梯度下降"""
    m, d = X.shape
    X_b = np.c_[np.ones(m), X]          # 加偏置列
    w = np.zeros((d + 1, 1))            # 初始化权重
    for _ in range(epochs):
        z = X_b @ w                      # 线性打分
        p = sigmoid(z)                   # 转成概率
        grad = X_b.T @ (p - y.reshape(-1, 1)) / m   # 交叉熵梯度 = (σ(z)-y)x
        w -= lr * grad                   # 梯度下降更新
    return w

w_hand = logistic_regression(X, y)
print("手写逻辑回归权重：", w_hand.ravel())

# ============ 3. sklearn 实现 ============
model = LogisticRegression()
model.fit(X, y)
print("sklearn 权重：", np.r_[model.intercept_, model.coef_[0]])

# ============ 4. 评估 ============
y_pred = model.predict(X)
print(f"\n准确率 = {accuracy_score(y, y_pred):.4f}")
print("混淆矩阵：\n", confusion_matrix(y, y_pred))

# ============ 5. 输出概率 ============
prob = model.predict_proba([[1.5, 1.5]])[0]
print(f"\n样本 (1.5, 1.5) 的类别概率：P(类0)={prob[0]:.3f}, P(类1)={prob[1]:.3f}")
