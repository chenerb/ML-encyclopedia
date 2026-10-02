"""
CNN 手写数字识别示例（MNIST）

对应正文：《CNN简介》《卷积层》《池化层》
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# ============ 1. 定义 CNN 结构 ============
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        # 卷积层1：1通道 → 16通道，3×3 卷积
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        # 卷积层2：16通道 → 32通道，3×3 卷积
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        # 池化：2×2 最大池化（缩小特征图）
        self.pool = nn.MaxPool2d(2, 2)
        # 全连接层：32*7*7 → 10 类
        self.fc = nn.Linear(32 * 7 * 7, 10)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))   # 卷积→ReLU→池化
        x = self.pool(F.relu(self.conv2(x)))   # 卷积→ReLU→池化
        x = x.view(x.size(0), -1)              # 展平
        x = self.fc(x)                         # 全连接分类
        return x

# ============ 2. 加载 MNIST 数据 ============
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))   # 标准化
])
train_set = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
test_set = datasets.MNIST(root='./data', train=False, download=True, transform=transform)
train_loader = DataLoader(train_set, batch_size=64, shuffle=True)
test_loader = DataLoader(test_set, batch_size=64, shuffle=False)

# ============ 3. 训练 ============
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SimpleCNN().to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

print(f"使用设备：{device}")
print("开始训练（CPU 可能需要几分钟）...\n")

epochs = 3
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()          # 反向传播
        optimizer.step()         # 梯度下降更新
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss = {running_loss/len(train_loader):.4f}")

# ============ 4. 测试 ============
model.eval()
correct = 0
total = 0
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

print(f"\n测试集准确率 = {100 * correct / total:.2f}%")
print("（这个简单的 CNN 就能达到 98%+ 的准确率！）")
