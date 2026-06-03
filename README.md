# 亲人纪念堂 (Family Memorial Hall)

亲人纪念堂游戏系统 - 一个提供沉浸式 3D 祭拜体验、家族族谱管理和生平故事协作编辑的 Web 应用。

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.184-black.svg)

## 项目概述

亲人纪念堂是一个专为家族设计的纪念系统，让家族成员可以：

- 在 **3D 沉浸式场景** 中进行祭拜
- 建立和管理 **家族族谱**
- 协作编辑已故亲人的 **生平故事**
- 上传和管理 **照片、视频等媒体文件**
- 收到 **忌日提醒** 和重要纪念通知
- 在纪念堂中 **留言** 寄托哀思

## 技术栈

### 前端

- **React 19** + **TypeScript 5**
- **Vite 5** - 快速构建工具
- **Three.js** + **React Three Fiber** - 3D 渲染
- **Zustand** - 轻量级状态管理
- **TanStack Query** - 数据请求和缓存
- **TailwindCSS 4** - 样式框架

### 后端

- **Node.js 18** + **Express.js**
- **TypeScript 5** - 强类型支持
- **PostgreSQL 15** - 主数据库
- **Redis 7** - 缓存和会话管理
- **MinIO** - S3 兼容的对象存储
- **JWT** + **bcrypt** - 认证加密
- **WebSocket** - 实时协作编辑
- **node-cron** - 定时任务调度

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- Docker 和 Docker Compose
- Git

### 1. 克隆项目

```bash
git clone https://github.com/yongqipan/family-memorial-hall.git
cd family-memorial-hall
```

### 2. 启动后端服务

```bash
cd backend

# 复制环境变量
cp .env.example .env

# 编辑 .env 配置（可选）
# 修改 JWT_SECRET 和其他必要的配置

# 启动依赖服务 (PostgreSQL, Redis, MinIO)
docker-compose up -d postgres redis minio

# 安装依赖
npm install

# 初始化数据库
npm run db:init

# 启动开发服务器
npm run dev
```

后端服务运行在 `http://localhost:3000`

### 3. 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务运行在 `http://localhost:5173`

### 4. 访问应用

打开浏览器访问 `http://localhost:5173`

## 项目结构

```
family-memorial-hall/
├── backend/                     # 后端服务
│   ├── src/
│   │   ├── config/              # 配置模块
│   │   ├── models/              # 数据模型
│   │   ├── repositories/        # 数据访问层
│   │   ├── services/            # 业务逻辑层
│   │   ├── controllers/         # 控制器
│   │   ├── middleware/          # 中间件
│   │   └── utils/               # 工具函数
│   ├── migrations/              # 数据库迁移
│   ├── docker-compose.yml       # Docker 编排
│   └── package.json
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── components/          # 可复用组件
│   │   ├── pages/               # 页面
│   │   ├── services/            # API 服务
│   │   ├── store/               # 状态管理
│   │   └── types/               # TypeScript 类型
│   ├── vite.config.ts           # Vite 配置
│   └── package.json
├── .monkeycode/                 # 项目文档
│   ├── specs/                   # 需求与设计文档
│   │   └── family-memorial-hall/
│   │       ├── requirements.md  # 需求文档
│   │       └── design.md        # 技术设计
│   ├── docs/                    # 其他文档
│   └── MEMORY.md                # 项目记忆
├── tasklist-backend.md          # 后端任务清单
├── tasklist-frontend.md         # 前端任务清单
├── PROJECT_SUMMARY.md           # 项目总结
└── README.md                    # 本文件
```

## 核心功能

### 1. 3D 祭拜场景
- 祠堂场景模板
- 360 度视角控制
- 祭拜动作交互（上香、献花、点烛）
- 光照和阴影效果

### 2. 用户认证
- 注册/登录
- JWT Token 自动刷新
- 路由守卫

### 3. 家族族谱
- 树状结构展示
- 已故成员标记
- 成员关系管理

### 4. 纪念堂管理
- 创建和自定义纪念堂
- 上传逝者照片和信息
- 祭拜记录

### 5. 生平故事
- 富文本编辑器
- 协作编辑（WebSocket + OT）
- 版本历史

### 6. 媒体库
- 照片墙和相册
- 视频上传
- 缩略图自动生成

### 7. 留言功能
- 在线留言
- 回复和互动

### 8. 提醒和通知
- 忌日提醒
- 定时任务调度
- 邮件通知

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token

### 纪念堂
- `GET /api/memorials` - 获取纪念堂列表
- `POST /api/memorials` - 创建纪念堂
- `GET /api/memorials/:id` - 获取纪念堂详情
- `PUT /api/memorials/:id` - 更新纪念堂
- `DELETE /api/memorials/:id` - 删除纪念堂
- `POST /api/memorials/:id/ritual` - 执行祭拜动作

### 家族
- `GET /api/family` - 获取家族树
- `POST /api/family/members` - 添加成员
- `PUT /api/family/members/:id` - 更新成员

### 媒体
- `POST /api/media/upload` - 上传媒体文件
- `GET /api/media/:id` - 获取媒体文件
- `DELETE /api/media/:id` - 删除媒体文件

## 开发

### 代码格式化

```bash
cd backend
npm run format

cd frontend
npm run lint -- --fix
```

### 运行测试

```bash
cd backend
npm run test
npm run test:coverage
```

### 数据库迁移

```bash
cd backend

# 创建新迁移
npm run db:migrate:create migration_name

# 执行迁移
npm run db:migrate

# 回滚迁移
npm run db:migrate:down
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 生产环境配置

1. 修改 `.env` 中的 `NODE_ENV=production`
2. 更换生产环境密钥（JWT_SECRET、数据库密码等）
3. 配置 HTTPS
4. 设置 CDN 域名
5. 配置生产数据库连接

## 文档

- [需求文档](.monkeycode/specs/family-memorial-hall/requirements.md)
- [技术设计文档](.monkeycode/specs/family-memorial-hall/design.md)
- [项目总结](PROJECT_SUMMARY.md)

## 开发路线图

### 阶段 1: 核心功能完善（1-2 周）
- [ ] 完整的服务层实现
- [ ] 认证和授权流程
- [ ] 纪念堂 CRUD 和祭拜功能
- [ ] 家族族谱管理

### 阶段 2: 媒体和社交功能（1-2 周）
- [ ] MinIO 媒体上传和展示
- [ ] 照片墙和相册管理
- [ ] 留言功能
- [ ] 生平故事协作编辑

### 阶段 3: 提醒和通知（1 周）
- [ ] 定时任务调度
- [ ] 邮件发送
- [ ] 站内通知
- [ ] 忌日提醒

### 阶段 4: 测试和优化（1 周）
- [ ] 单元测试覆盖
- [ ] 集成测试
- [ ] 性能优化
- [ ] 安全加固

### 阶段 5: 部署上线（1 周）
- [ ] 生产环境配置
- [ ] CI/CD 流水线
- [ ] 监控和日志
- [ ] 备份策略

## 注意事项

1. **环境配置**: 确保 PostgreSQL、Redis、MinIO 正确配置
2. **安全性**: JWT 密钥和数据库密码需要更换为生产环境值
3. **性能**: 3D 场景在移动端需要优化
4. **隐私**: 家族数据需要严格访问控制
5. **备份**: 定期备份数据库和媒体文件

## 许可证

MIT

## 联系方式

项目作者：[yongqipan](https://github.com/yongqipan)

项目地址：[https://github.com/yongqipan/family-memorial-hall](https://github.com/yongqipan/family-memorial-hall)
