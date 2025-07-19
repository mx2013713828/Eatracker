# 一日三餐 - 家庭饮食管理系统

一个帮助家庭管理日常饮食的应用系统，支持食材管理、菜谱推荐、营养追踪等功能。

## 已实现功能

1. 用户认证系统
   - 用户注册和登录
   - JWT token 认证
   - 安全的密码加密存储
   - 会话管理和退出功能

2. 个人信息管理
   - 基本信息维护（用户名、姓名）
   - 身体数据记录（年龄、身高、体重）
   - 自动 BMI 计算
   - 数据更新时间追踪

3. 用户界面
   - 响应式布局设计
   - 现代化的 Material Design
   - 直观的导航系统
   - 用户友好的表单验证
   - 操作反馈（加载状态、成功/错误提示）

## 开发中功能

1. 食材管理
   - 食材库存记录
   - 保质期提醒
   - 库存预警
   - 使用记录追踪

2. 菜谱系统
   - 菜品数据库
   - 基于现有食材的菜品推荐
   - 营养成分分析
   - 烹饪步骤指导

3. 营养追踪
   - 每日营养摄入记录
   - 营养需求分析
   - 个性化饮食建议
   - 营养摄入趋势分析

4. 家庭协作
   - 家庭成员管理
   - 角色权限控制
   - 膳食计划共享
   - 购物清单协作

## 待优化方向

1. 性能优化
   - 数据缓存策略
   - 图片懒加载
   - 代码分割
   - 服务端渲染支持

2. 用户体验
   - 深色模式支持
   - 自定义主题
   - 快捷键支持
   - 操作历史记录

3. 安全性
   - 请求速率限制
   - 日志记录
   - 敏感数据加密
   - HTTPS 支持

4. 可维护性
   - 单元测试覆盖
   - 端到端测试
   - 代码文档完善
   - 错误监控系统

## 安装部署指南

### 环境要求

- Node.js >= 16.x
- MongoDB >= 4.4
- npm >= 8.x

### Mac 环境搭建

1. 安装 Homebrew（如果未安装）
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安装 Node.js
```bash
brew install node
```

3. 安装 MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

4. 启动 MongoDB 服务
```bash
brew services start mongodb-community
```

### 项目安装

1. 克隆项目
```bash
git clone [项目地址]
cd eatracker
```

2. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install --legacy-peer-deps

# 安装后端依赖
cd ../backend
npm install
```

3. 环境配置
```bash
# 在后端目录创建 .env 文件
cd backend
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eatracker
JWT_SECRET=your_jwt_secret_key
EOL
```

### 启动服务

1. 开发模式
```bash
# 在项目根目录
npm start
```

2. 分别启动服务
```bash
# 启动后端服务
cd backend
npm run dev

# 新开终端，启动前端服务
cd frontend
npm start
```

### 访问应用

- 前端页面：http://localhost:3000
- 后端API：http://localhost:5000

## 技术栈

### 前端
- React 18
- TypeScript 4.9
- Material-UI 5.11
- React Router 7.7
- Axios

### 后端
- Node.js
- Express 4.18
- TypeScript 4.9
- MongoDB
- Mongoose 7.0
- JWT

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE) 