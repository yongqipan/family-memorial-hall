# 后端运行状态

## 当前状态 ✅

后端代码已完整实现，可以启动，但由于缺少数据库服务（PostgreSQL、Redis、MinIO），数据库连接会失败。

**服务器状态**:
- ✅ Node.js 代码编译成功
- ✅ Express 服务器可以启动在 `http://localhost:3000`
- ✅ 健康检查端点可用：`GET /api/health`
- ⚠️ 数据库连接失败（因为缺少 PostgreSQL）
- ⚠️ Redis 连接失败（因为缺少 Redis）
- ⚠️ MinIO 连接失败（因为缺少 MinIO）

## 运行后端的方式

### 方式 1: 安装 Docker（推荐用于完整功能）

**macOS**:
```bash
# 安装 Docker Desktop
brew install --cask docker
# 启动 Docker Desktop 应用
open /Applications/Docker.app
```

**Linux (Ubuntu/Debian)**:
```bash
# 安装 Docker Engine
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo usermod -aG docker $USER
# 重新登录生效
```

然后运行:
```bash
cd backend
docker-compose up -d  # 启动 PostgreSQL, Redis, MinIO
npm run db:init       # 初始化数据库表
npm run dev           # 启动后端开发服务器
```

### 方式 2: 本地安装数据库服务（无 Docker）

**安装 PostgreSQL** (macOS):
```bash
brew install postgresql@15
brew services start postgresql@15
```

**安装 PostgreSQL** (Linux):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**安装 Redis** (macOS):
```bash
brew install redis
brew services start redis
```

**安装 Redis** (Linux):
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**安装 MinIO** (所有平台):
```bash
# 下载 MinIO
curl -O https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
# 启动 MinIO
./minio server /data
```

然后配置 `.env` 文件，最后运行:
```bash
cd backend
npm run db:init
npm run dev
```

### 方式 3: 使用在线数据库服务（无需本地安装）

1. **PostgreSQL**: 使用 [Neon](https://neon.tech) 或 [Supabase](https://supabase.com) 的免费 PostgreSQL
2. **Redis**: 使用 [Upstash](https://upstash.com) 的免费 Redis
3. **MinIO**: 暂时不使用，或使用 AWS S3

配置 `.env` 文件：
```env
DB_HOST=xxx.xxx.xx.xx  # Neon/Supabase 提供的地址
REDIS_HOST=xxx.upstash.io  # Upstash 提供的地址
MINIO_ENDPOINT=s3.amazonaws.com  # 使用 AWS S3
```

### 方式 4: 仅运行（无数据库）- 适合开发前端

如果只是想测试前端，可以让后端保持当前状态运行：

```bash
cd backend
npm run dev
```

虽然数据库连接失败，但服务器会一直运行在 `http://localhost:3000`。前端可以通过 API 代理访问。

## 已实现的 API 端点

由于数据库未连接，这些端点目前返回错误响应，但路由已定义：

- `GET /api/health` - 健康检查 ✅ 可用
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token
- `POST /api/memorials` - 创建纪念堂
- `GET /api/memorials/:id` - 获取纪念堂详情
- `POST /api/memorials/:id/rituals` - 执行祭拜
- `POST /api/family/members` - 添加家族成员
- `GET /api/family/tree` - 获取族谱
- `POST /api/media/upload` - 获取上传 URL
- `GET /api/notifications` - 获取通知列表

## 项目代码

所有代码已提交到 GitHub:
https://github.com/yongqipan/family-memorial-hall

## 前端预览

前端运行在:
https://5173-2d2cf9541ad70c8f.monkeycode-ai.online
