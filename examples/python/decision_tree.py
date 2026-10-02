"""
决策树示例：训练 + 可视化决策路径

对应正文：《决策树：像玩"二十个问题"一样做判断》
"""

from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# ============ 1. 加载鸢尾花数据 ============
iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.feature_names
class_names = iris.target_names

# ============ 2. 划分训练/测试集 ============
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# ============ 3. 训练决策树（限制深度防过拟合）============
# max_depth 是"预剪枝"：限制树的最大深度
tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_train, y_train)

# ============ 4. 评估 ============
y_pred = tree.predict(X_test)
print(f"测试集准确率 = {accuracy_score(y_test, y_pred):.4f}")
print(f"树的最大深度 = {tree.get_depth()}")

# ============ 5. 特征重要性 ============
print("\n特征重要性（哪个特征最"会提问"）：")
for name, imp in zip(feature_names, tree.feature_importances_):
    print(f"  {name}: {imp:.4f}")

# ============ 6. 可视化决策树 ============
plt.figure(figsize=(12, 8))
plot_tree(tree, feature_names=feature_names,
          class_names=class_names, filled=True, rounded=True)
plt.title("决策树：每个节点都是一次"是/否"提问")
plt.savefig("decision_tree.png", dpi=150, bbox_inches="tight")
print("\n决策树已保存为 decision_tree.png，打开看看它如何"提问"！")
