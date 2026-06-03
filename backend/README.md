# 亲人纪念堂后端服务

## 功能特性

- **用户认证**: JWT Token 认证、邀请码注册、家族权限管理
- **纪念堂管理**: 3D 场景配置、祭拜动作记录、生平故事管理
- **家族族谱**: 多代家族树、成员关系管理
- **媒体存储**: MinIO 对象存储、照片视频上传、缩略图生成
- **忌日提醒**: 定时任务调度、邮件发送、站内通知
- **协作编辑**: WebSocket 实时协作、版本控制、冲突解决

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript 5.3+
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **对象存储**: MinIO (S3 兼容)
- **认证**: JWT + bcrypt

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 15.0
- Redis >= 7.0
- MinIO (或使用 AWS S3)

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库、Redis、MinIO 等连接信息
```

### 初始化数据库

```bash
npm run db:init
# 或手动执行
npx tsx src/scripts/migrate.ts
```

### 启动开发服务器

```bash
npm run dev
```

服务将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
npm start
```

## API 文档

启动服务后，访问以下端点:

- 健康检查：`GET /api/health`
- API 文档: `GET /api/docs` (Swagger UI)

## 主要端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token

### 纪念堂
- `POST /api/memorials` - 创建纪念堂
- `GET /api/memorials/:id` - 获取纪念堂详情
- `PUT /api/memorials/:id` - 更新纪念堂
- `POST /api/memorials/:id/rituals` - 执行祭拜

### 家族
- `POST /api/family/members` - 添加家族成员
- `GET /api/family/tree` - 获取族谱
- `POST /api/family/members/:id/deceased` - 标记为已故

### 媒体
- `POST /api/media/upload` - 获取上传 URL
- `GET /api/media/memorial/:memorialId` - 获取媒体列表

### 通知
- `GET /api/notifications` - 获取通知列表
- `PUT /api/notifications/:id/read` - 标记为已读

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   ├── index.ts     # 主配置
│   │   ├── database.ts  # 数据库配置
│   │   ├── redis.ts     # Redis 配置
│   │   └── minio.ts     # MinIO 配置
│   ├── models/          # 数据模型
│   │   ├── enums.ts     # 枚举类型
│   │   ├── user.model.ts
│   │   ├── memorial.model.ts
│   │   ├── family.model.ts
│   │   ├── media.model.ts
│   │   ├── message.model.ts
│   │   ├── reminder.model.ts
│   │   └── validators.ts
│   ├── repositories/    # 数据访问层
│   │   ├── base.repository.ts
│   │   ├── user.repository.ts
│   │   ├── memorial.repository.ts
│   │   └── ...
│   ├── services/        # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── memorial.service.ts
│   │   └── ...
│   ├── api/             # API 路由
│   │   ├── routes/
│   │   └── controllers/
│   ├── middleware/      # 中间件
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/           # 工具函数
│   │   ├── auth.ts      # JWT 工具
│   │   └── errors.ts    # 自定义错误
│   └── index.ts         # 应用入口
├── migrations/          # 数据库迁移
├── tests/              # 测试文件
├── logs/               # 日志目录
└── package.json
```

## 开发规范

### 代码风格

- 使用 ESLint + Prettier 格式化代码
- 遵循 TypeScript 严格模式

```bash
npm run lint
npm run format
```

### 测试

```bash
npm test
npm run test:coverage
```

## Docker 部署

使用 `docker-compose.yml` 启动所有依赖服务:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: memorial_hall
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine

  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
```

## License

MIT
