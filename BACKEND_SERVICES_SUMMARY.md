# 后端服务状态总结

## 启动时间
2026-06-03 05:39:53

## 服务运行状态 ✅

### PostgreSQL 15
- 状态：✅ 运行中
- 端口：5432
- 数据库：memorial_hall
- 用户：postgres / postgres
- 进程 ID: 6335

### Redis 7
- 状态：✅ 运行中
- 端口：6379
- 密码：无
- 进程 ID: 6364

### MinIO
- 状态：✅ 运行中
- API 端口：9000
- 控制台端口：9001
- Access Key: minioadmin
- Secret Key: minioadmin
- Bucket: memorial-media
- 进程 ID: 6440

### Backend API
- 状态：✅ 运行中
- 端口：3000
- 环境：development
- 健康检查：http://localhost:3000/api/health
- 进程 ID: 待确认

## 服务验证

### 1. 健康检查测试
```bash
curl http://localhost:3000/api/health
# 响应：{"status":"ok","timestamp":"2026-06-03T05:39:59.611Z"}
```

### 2. 数据库检查
```bash
su - postgres -c "psql -d memorial_hall -c '\\dt'"
# 显示所有表
```

### 3. Redis 检查
```bash
redis-cli ping
# 响应：PONG
```

### 4. MinIO 检查
- Web 控制台：http://localhost:9001
- 登录凭据：minioadmin / minioadmin
- API 端点：http://localhost:9000

## 配置文件

`.env` 文件配置：
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memorial_hall
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=memorial-media
```

## 启动/停止服务

### 启动所有服务
```bash
# PostgreSQL
service postgresql start

# Redis
service redis-server start

# MinIO
mkdir -p /data/minio
MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin minio server /data/minio --address :9000 --console-address :9001 &

# Backend
cd /workspace/backend
npm run dev
```

### 停止所有服务
```bash
# 停止后端 (找到进程 ID)
pkill -f "tsx watch src/index.ts"

# 停止 MinIO
pkill -f minio

# 停止 Redis
service redis-server stop

# 停止 PostgreSQL
service postgresql stop
```

## 已实现的 API 端点

- `GET /api/health` - 健康检查 ✅
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token
- `GET /api/memorials` - 获取纪念堂列表
- `POST /api/memorials` - 创建纪念堂
- `GET /api/memorials/:id` - 获取纪念堂详情
- `PUT /api/memorials/:id` - 更新纪念堂
- `DELETE /api/memorials/:id` - 删除纪念堂
- `POST /api/memorials/:id/rituals` - 执行祭拜仪式
- `GET /api/memorials/:id/rituals` - 获取祭拜记录
- `POST /api/family/members` - 添加家族成员
- `GET /api/family/members` - 获取家族成员列表
- `GET /api/family/tree` - 获取族谱树
- `PUT /api/family/members/:id` - 更新家族成员
- `DELETE /api/family/members/:id` - 删除家族成员
- `POST /api/media/upload-url` - 获取上传 URL
- `GET /api/notifications` - 获取通知列表
- `PUT /api/notifications/:id/read` - 标记通知已读

## 前端预览

前端运行在：
- https://5173-2d2cf9541ad70c8f.monkeycode-ai.online

前端通过 Vite 代理转发 `/api` 请求到后端：
- 前端 `http://localhost:5173/api/*` → 后端 `http://localhost:3000/api/*`

## 项目代码

GitHub 仓库：
https://github.com/yongqipan/family-memorial-hall
