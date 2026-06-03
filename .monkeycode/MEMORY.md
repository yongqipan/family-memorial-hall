# 用户指令记忆

本文件记录了用户的指令、偏好和教导，用于在未来的交互中提供参考。

## 格式

### 用户指令条目
用户指令条目应遵循以下格式:

[用户指令摘要]
- Date: [YYYY-MM-DD]
- Context: [提及的场景或时间]
- Instructions:
  - [用户教导或指示的内容，逐行描述]

### 项目知识条目
Agent 在任务执行过程中发现的条目应遵循以下格式:

[项目知识摘要]
- Date: [YYYY-MM-DD]
- Context: Agent 在执行 [具体任务描述] 时发现
- Category: [运维部署 | 构建方法 | 测试方法 | 排错调试 | 工作流协作 | 环境配置]
- Instructions:
  - [具体的知识点，逐行描述]

## 去重策略
- 添加新条目前，检查是否存在相似或相同的指令
- 若发现重复，跳过新条目或与已有条目合并
- 合并时，更新上下文或日期信息
- 这有助于避免冗余条目，保持记忆文件整洁

## 条目

[家人纪念堂项目知识]
- Date: 2026-06-03
- Context: Agent 在实现亲人纪念堂项目时发现
- Category: 构建方法
- Instructions:
  - 后端项目使用 Node.js 18 + TypeScript，使用 tsx 进行开发模式运行
  - 前端项目使用 Vite 5 + React 18 + TypeScript
  - 后端必须使用 Docker Compose 启动 PostgreSQL 15, Redis 7, MinIO 三个依赖服务
  - 后端数据库初始化需要使用 npm run db:init 命令执行迁移脚本
  - 前后端分离开发时，前端通过 Vite 代理将/api 请求转发到后端 localhost:3000
