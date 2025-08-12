# Backend Scripts 脚本说明

本目录包含项目的后端管理和测试脚本。

## 🚀 脚本管理器 (推荐使用)

我们提供了一个统一的脚本管理器，简化脚本的使用：

### 基本用法
```bash
# 查看所有可用脚本
node scripts/run.js help

# 使用简化命令运行脚本
node scripts/run.js <script-name> [args...]
```

### 快速命令
```bash
# 数据库统计
node scripts/run.js cleanup stats

# 清理所有用户数据  
node scripts/run.js cleanup users

# 删除指定用户
node scripts/run.js cleanup user testuser

# 运行API测试
node scripts/run.js test-api

# 运行功能演示
node scripts/run.js demo
```

## 📁 脚本列表

### 0. run.js
**脚本管理器** - 统一的脚本运行入口

#### 功能
- 提供友好的命令行界面
- 统一的脚本运行方式
- 自动处理错误和状态码
- 内置帮助文档

### 1. cleanup-database.js
**数据库清理脚本** - 用于管理和清理数据库数据

#### 功能
- 清理用户数据和关联的食材
- 支持全量清理和指定用户清理
- 显示数据库统计信息

#### 使用方法
```bash
# 查看帮助
node scripts/cleanup-database.js

# 查看数据库统计
node scripts/cleanup-database.js stats

# 删除所有用户和食材
node scripts/cleanup-database.js users

# 删除指定用户和其食材
node scripts/cleanup-database.js user <username>

# 清空所有数据
node scripts/cleanup-database.js all
```

### 2. test-ingredient-api.js
**食材API测试脚本** - 自动化测试食材管理API的完整功能

#### 功能
- 用户注册/登录测试
- 食材CRUD操作测试
- 数据验证和权限检查
- 错误处理验证

#### 使用方法
```bash
# 安装测试依赖
npm install axios

# 运行完整API测试
node scripts/test-ingredient-api.js
```

#### 测试覆盖
- ✅ 用户认证流程
- ✅ 食材添加功能
- ✅ 食材列表获取
- ✅ 食材更新功能
- ✅ 单个食材查询
- ✅ 食材删除功能
- ✅ 数据一致性验证

### 3. demo-ingredient-features.js
**食材功能演示脚本** - 展示食材管理系统的核心特性

#### 功能
- 创建演示用户和食材数据
- 展示数据隔离功能
- 演示过期状态分析
- 营养信息统计展示
- 食材分类管理演示

#### 使用方法
```bash
node scripts/demo-ingredient-features.js
```

#### 演示内容
- 🔐 用户数据隔离
- 📅 智能过期管理
- 🥄 营养信息追踪
- 📊 分类管理
- 🔍 灵活查询
- 💾 持久化存储

## 🚀 快速开始

### 环境准备
确保MongoDB服务正在运行：
```bash
brew services start mongodb-community
```

### 常用操作流程

#### 1. 开发测试流程
```bash
# 1. 查看当前数据状态
node scripts/cleanup-database.js stats

# 2. 清理测试数据
node scripts/cleanup-database.js users

# 3. 运行API测试
node scripts/test-ingredient-api.js

# 4. 查看测试结果
node scripts/cleanup-database.js stats
```

#### 2. 功能演示流程
```bash
# 1. 清理现有数据
node scripts/cleanup-database.js all

# 2. 运行功能演示
node scripts/demo-ingredient-features.js

# 3. 查看演示数据
node scripts/cleanup-database.js stats
```

#### 3. 问题排查流程
```bash
# 1. 检查数据库连接
node scripts/cleanup-database.js stats

# 2. 运行API测试验证功能
node scripts/test-ingredient-api.js

# 3. 如有问题，清理数据重新测试
node scripts/cleanup-database.js users
```

## ⚠️ 注意事项

### 数据安全
- ⚠️ **生产环境**: 请勿在生产环境运行清理脚本
- ✅ **开发环境**: 脚本专为开发和测试环境设计
- 🔒 **数据备份**: 重要数据操作前请先备份

### 依赖要求
- MongoDB 服务必须运行
- Node.js 环境正常
- 网络连接正常（API测试需要）

### 常见问题
1. **连接失败**: 检查MongoDB服务是否启动
2. **权限错误**: 确认在正确的目录执行脚本
3. **测试失败**: 检查后端服务是否正常运行

## 📝 脚本开发规范

### 新增脚本要求
1. **命名规范**: 使用 kebab-case 命名
2. **功能单一**: 每个脚本专注单一功能
3. **错误处理**: 完善的错误处理和日志
4. **文档说明**: 更新本README文档

### 代码示例
```javascript
/**
 * 脚本功能描述
 */
const mongoose = require('mongoose');
require('dotenv').config();

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eatracker');
    console.log('MongoDB 连接成功');
    
    // 脚本主要逻辑
    
  } catch (error) {
    console.error('脚本执行失败:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

main().catch(console.error);
```

---

*最后更新: 2025年8月12日* 