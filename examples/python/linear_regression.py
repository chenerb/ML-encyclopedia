"""
线性回归示例：手写最小二乘 + sklearn 对比

对应正文：《线性回归：机器学习的第一课》
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# ============ 1. 生成模拟数据 ============
# 假设真实关系：y = 2x + 1，加上随机噪声
np.random.seed(42)
X = np.random.rand(100, 1) * 10          # 100 个样本，1 个特征（0~10）
y = 2 * X + 1 + np.random.randn(100, 1) * 0.5   # 加噪声

# ============ 2. 手写最小二乘（解析解）============
# 正规方程：w = (XᵀX)⁻¹ Xᵀy
# 注意：需要给 X 加一列 1，表示偏置 b
X_b = np.c_[np.ones((100, 1)), X]         # 加上偏置列

# 求解 w = (XᵀX)⁻¹ Xᵀy
w_hand = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y
print("手写最小二乘结果：")
print(f"  截距 b = {w_hand[0][0]:.4f}（真实值 1）")
print(f"  斜率 w = {w_hand[1][0]:.4f}（真实值 2）")

# ============ 3. sklearn 实现 ============
model = LinearRegression()
model.fit(X, y)
print("\nsklearn 结果：")
print(f"  截距 b = {model.intercept_[0]:.4f}")
print(f"  斜率 w = {model.coef_[0][0]:.4f}")

# ============ 4. 评估 ============
y_pred = model.predict(X)
mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)
print(f"\n评估指标：")
print(f"  MSE = {mse:.4f}")
print(f"  R²  = {r2:.4f}（越接近 1 越好）")

# ============ 5. 预测新样本 ============
new_x = np.array([[5.5]])   # 预测 x=5.5 时的 y
new_pred = model.predict(new_x)
print(f"\n预测 x=5.5 时，y ≈ {new_pred[0][0]:.4f}（真实值约 2×5.5+1=12）")
