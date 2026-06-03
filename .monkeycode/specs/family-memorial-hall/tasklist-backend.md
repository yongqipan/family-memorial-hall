# 后端实施计划

- [ ] 1. 设置项目结构和核心接口
   - 创建后端项目目录结构 (src/models, src/services, src/repositories, src/api, src/middleware, src/utils)
   - 初始化 Node.js + TypeScript 项目
   - 配置 ESLint + Prettier 代码规范
   - 设置 Jest 测试框架

- [ ] 2. 实现数据模型和验证
  - [ ] 2.1 创建核心数据模型接口和类型
    - 定义 User, Memorial, FamilyMember, RitualRecord, Message, Media, Reminder 接口
    - 定义枚举类型 (UserStatus, SceneType, RitualType, MediaType, ReminderType, ReminderStatus)
    - 实现数据验证函数 (zod 或 Joi)

  - [ ] 2.2 实现用户模型
    - 创建 User 类，包含密码哈希、token 生成、账号锁定逻辑
    - 实现用户注册、登录验证方法

  - [ ] 2.3 实现纪念堂模型
    - 创建 Memorial 类，包含祭拜计数、存储配额管理
    - 实现场景配置序列化

  - [ ] 2.4 实现家族成员模型
    - 创建 FamilyMember 类，包含族谱关系管理
    - 实现父子、配偶关系的添加和验证

  - [ ]* 2.5 为数据模型编写单元测试

- [ ] 3. 检查点 - 确保所有测试通过

- [ ] 4. 创建数据库层
  - [ ] 4.1 实现 PostgreSQL 连接管理
    - 使用 pg-pool 创建连接池
    - 实现数据库迁移工具 (使用 node-pg-migrate)
    - 创建数据库初始化脚本

  - [ ] 4.2 编写数据库迁移脚本
    - 创建 users 表
    - 创建 memorials 表
    - 创建 family_members 表
    - 创建 ritual_records 表
    - 创建 messages 表
    - 创建 media 表
    - 创建 reminders 表
    - 创建必要的索引和外键约束

  - [ ] 4.3 实现存储库模式
    - 创建 BaseRepository 基类，封装 CRUD 操作
    - 实现 UserRepository
    - 实现 MemorialRepository
    - 实现 FamilyRepository
    - 实现 RitualRepository
    - 实现 MessageRepository
    - 实现 MediaRepository
    - 实现 ReminderRepository

  - [ ]* 4.4 为存储库操作编写单元测试

- [ ] 5. 检查点 - 确保所有测试通过

- [ ] 6. 实现认证服务 (AuthService)
  - [ ] 6.1 实现 JWT Token 管理
    - 创建 token 生成和验证工具
    - 实现 refresh token 机制
    - 实现 token 黑名单 (Redis)

  - [ ] 6.2 实现用户注册流程
    - 邮箱格式验证
    - 密码强度验证
    - 邀请码验证
    - 发送邀请邮件

  - [ ] 6.3 实现登录流程
    - 密码验证
    - 失败次数计数和账号锁定
    - 登录成功返回 JWT

  - [ ] 6.4 实现家族成员管理
    - 邀请家族成员
    - 移除家族成员
    - 角色权限管理

  - [ ]* 6.5 为认证服务编写单元测试

- [ ] 7. 实现纪念堂服务 (MemorialService)
  - [ ] 7.1 实现纪念堂 CRUD
    - 创建纪念堂
    - 获取纪念堂详情
    - 更新纪念堂信息
    - 删除纪念堂

  - [ ] 7.2 实现祭拜功能
    - 处理献花、点烛、上香、鞠躬、供奉祭品动作
    - 记录祭拜数据
    - 更新祭拜计数 (今日和累计)

  - [ ] 7.3 实现祭拜统计
    - 获取祭拜记录列表
    - 计算祭拜统计数据
    - 生成祭拜日历数据

  - [ ]* 7.4 为纪念堂服务编写单元测试

- [ ] 8. 实现家族管理服务 (FamilyService)
  - [ ] 8.1 实现家族成员管理
    - 添加家族成员
    - 更新成员信息
    - 标记成员为已故并创建纪念堂

  - [ ] 8.2 实现族谱构建
    - 构建家族树数据结构
    - 支持多代展示
    - 标注已故成员

  - [ ] 8.3 实现成员关系管理
    - 设置父母、配偶、子女关系
    - 关系冲突检测和提示

  - [ ]* 8.4 为家族管理服务编写单元测试

- [ ] 9. 检查点 - 确保所有测试通过

- [ ] 10. 实现媒体服务 (MediaService)
  - [ ] 10.1 实现 MinIO 对象存储集成
    - 配置 MinIO 客户端
    - 实现文件上传 (预签名 URL)
    - 实现文件下载
    - 实现文件删除

  - [ ] 10.2 实现媒体文件管理
    - 照片视频上传
    - 存储空间配额检查
    - 生成缩略图 (使用 sharp)

  - [ ] 10.3 实现媒体列表和分类
    - 按纪念堂获取媒体列表
    - 支持相册分类
    - 按时间排序

  - [ ]* 10.4 为媒体服务编写单元测试

- [ ] 11. 实现通知服务 (NotifyService)
  - [ ] 11.1 实现忌日提醒调度
    - 计算忌日前 7 天和当天日期
    - 使用 node-cron 创建定时任务
    - 调度邮件和站内通知

  - [ ] 11.2 实现邮件发送
    - 集成 SendGrid/AWS SES
    - 实现邮件模板渲染
    - 实现失败重试机制 (最多 3 次)

  - [ ] 11.3 实现站内通知
    - 创建通知记录
    - 获取用户通知列表
    - 标记为已读

  - [ ]* 11.4 为通知服务编写单元测试

- [ ] 12. 实现协作编辑服务 (CollaborativeService)
  - [ ] 12.1 实现 WebSocket 连接管理
    - 使用 ws 库创建 WebSocket 服务器
    - 实现编辑房间管理
    - 实现用户权限验证

  - [ ] 12.2 实现 OT (Operational Transform) 算法
    - 实现文本插入操作转换
    - 实现文本删除操作转换
    - 实现操作合并

  - [ ] 12.3 实现版本控制
    - 保存编辑历史版本
    - 支持版本回溯
    - 显示版本差异

  - [ ] 12.4 实现冲突解决
    - 自动合并策略
    - 手动合并提示

  - [ ]* 12.5 为协作编辑服务编写单元测试

- [ ] 13. 检查点 - 确保所有测试通过

- [ ] 14. 实现 API 网关和中间件
  - [ ] 14.1 配置 Express/Fastify 应用
    - 创建应用实例
    - 配置 CORS
    - 配置请求解析

  - [ ] 14.2 实现认证中间件
    - JWT token 验证
    - 用户信息注入到请求上下文

  - [ ] 14.3 实现权限中间件
    - 检查家族成员权限
    - 检查管理员权限
    - 返回 403 错误

  - [ ] 14.4 实现错误处理中间件
    - 统一错误响应格式
    - 业务异常处理
    - 全局异常捕获

  - [ ] 14.5 实现限流中间件
    - 使用 Redis 实现请求限流
    - 防止暴力破解

  - [ ]* 14.6 实现请求日志中间件

- [ ] 15. 实现 REST API 路由
  - [ ] 15.1 实现认证 API
    - POST /api/auth/register - 用户注册
    - POST /api/auth/login - 用户登录
    - POST /api/auth/refresh - 刷新 token
    - POST /api/auth/invite - 邀请成员
    - DELETE /api/auth/member/:id - 移除成员

  - [ ] 15.2 实现纪念堂 API
    - POST /api/memorials - 创建纪念堂
    - GET /api/memorials/:id - 获取纪念堂详情
    - PUT /api/memorials/:id - 更新纪念堂
    - POST /api/memorials/:id/rituals - 执行祭拜
    - GET /api/memorials/:id/rituals - 获取祭拜记录
    - GET /api/memorials/:id/statistics - 获取祭拜统计

  - [ ] 15.3 实现家族 API
    - POST /api/family/members - 添加成员
    - GET /api/family/tree - 获取族谱
    - PUT /api/family/members/:id/relation - 更新关系
    - POST /api/family/members/:id/deceased - 标记为已故
    - GET /api/family/members - 获取成员列表

  - [ ] 15.4 实现媒体 API
    - POST /api/media/upload - 上传媒体 (返回预签名 URL)
    - GET /api/media/:id - 获取媒体信息
    - DELETE /api/media/:id - 删除媒体
    - GET /api/media/memorial/:memorialId - 获取纪念堂媒体列表
    - POST /api/media/:id/thumbnail - 生成缩略图

  - [ ] 15.5 实现通知 API
    - GET /api/notifications - 获取通知列表
    - PUT /api/notifications/:id/read - 标记为已读
    - POST /api/reminders/schedule - 调度提醒
    - DELETE /api/reminders/:id - 取消提醒

  - [ ] 15.6 实现协作编辑 API
    - GET /api/collaborate/:memorialId - 加入编辑房间 (WebSocket)
    - GET /api/collaborate/:memorialId/versions - 获取版本历史
    - POST /api/collaborate/:memorialId/versions - 保存版本
    - PUT /api/collaborate/versions/:id/restore - 恢复版本

  - [ ]* 15.7 为 API 路由编写集成测试

- [ ] 16. 检查点 - 确保所有测试通过

- [ ] 17. 实现数据备份和恢复工具
  - [ ] 17.1 实现数据导出功能
    - 导出纪念堂数据为 PDF
    - 导出为 ZIP 压缩包 (包含媒体文件)

  - [ ] 17.2 实现自动备份调度
    - 每日备份到异地存储
    - 备份验证和告警

  - [ ] 17.3 实现数据恢复功能
    - 从备份恢复指定日期数据

- [ ] 18. 项目配置和优化
  - [ ] 18.1 配置环境变量
    - 数据库连接配置
    - JWT 密钥配置
    - MinIO 配置
    - 邮件服务配置

  - [ ] 18.2 配置 Docker 容器化
    - 创建 Dockerfile
    - 创建 docker-compose.yml (包含 PostgreSQL, Redis, MinIO)

  - [ ] 18.3 性能优化
    - 配置数据库连接池大小
    - 配置 Redis 缓存策略
    - 配置 CDN 分发

  - [ ] 18.4 编写 API 文档
    - 使用 Swagger/OpenAPI 生成 API 文档
    - 编写接口使用说明
