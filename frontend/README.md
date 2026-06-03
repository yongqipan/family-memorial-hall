# 亲人纪念堂 - 前端项目

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **3D 渲染**: Three.js + React Three Fiber + Drei
- **路由**: React Router v6
- **状态管理**: Zustand
- **数据请求**: Axios + TanStack Query
- **样式**: TailwindCSS
- **图标**: Lucide React

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置后端 API 地址:

```
VITE_API_URL=http://localhost:3000/api
```

### 启动开发服务器

```bash
npm run dev
```

服务将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── components/        # 可复用组件
│   │   ├── PrivateRoute.tsx      # 路由守卫
│   │   └── RitualScene.tsx       # 3D 祭拜场景
│   ├── pages/             # 页面组件
│   │   ├── Login.tsx               # 登录页
│   │   ├── Register.tsx            # 注册页
│   │   ├── MemorialHall.tsx        # 纪念堂主页
│   │   ├── FamilyTree.tsx          # 族谱页
│   │   ├── Biography.tsx           # 生平故事
│   │   ├── MediaGallery.tsx        # 照片墙
│   │   ├── Messages.tsx            # 留言页
│   │   └── Profile.tsx             # 个人资料
│   ├── services/          # API 服务
│   │   ├── api.ts                  # Axios 实例
│   │   ├── auth.service.ts         # 认证服务
│   │   └── memorial.service.ts     # 纪念堂服务
│   ├── store/             # Zustand 状态管理
│   │   └── auth.store.ts           # 认证状态
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── hooks/             # 自定义 Hooks
│   ├── styles/            # 样式文件
│   ├── App.tsx            # 应用主组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── public/                # 静态资源
├── index.html             # HTML 模板
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # TailwindCSS 配置
└── package.json
```

## 功能特性

### 1. 用户认证
- 邮箱密码登录
- 邀请码注册
- JWT Token 自动刷新
- 登录状态持久化

### 2. 3D 纪念堂场景
- 祠堂/墓碑两种场景模板
- 360 度视角控制
- 祭拜动作交互 (献花、点烛、上香、鞠躬、供奉)
- 粒子效果 (香烟、火焰)

### 3. 家族族谱
- 树状结构展示
- 已故成员标记
- 点击跳转到纪念堂

### 4. 生平故事 (开发中)
- 富文本编辑器
- 实时协作编辑
- 版本控制

### 5. 照片墙 (开发中)
- 瀑布流布局
- 懒加载优化
- 全屏预览

### 6. 留言区 (开发中)
- 留言发布
- 留言管理
- 表情支持

## API 代理

Vite 开发服务器已配置 API 代理到后端:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

生产环境请配置 CDN 或直接使用后端 API 地址。

## 性能优化

- 代码分割 (Lazy Loading)
- 图片懒加载
- 3D 场景 LOD (Level of Detail)
- React.memo 组件缓存
- TanStack Query 缓存策略

## 响应式设计

适配桌面端和移动端:

- 桌面端：完整 3D 场景体验
- 移动端：简化交互，触摸优化

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端 Safari/Chrome

## 开发注意事项

### 3D 场景性能

Three.js 渲染比较消耗性能，建议:

1. 使用 Draco 压缩 GLTF 模型
2. 启用阴影裁剪 (frustum culling)
3. 合理使用 LOD
4. 移动端降低渲染质量

### Token 管理

认证 Token 存储在 localStorage，通过 Axios 拦截器自动添加和刷新。

### 状态管理

- 全局状态：Zustand (用户信息、主题等)
- 服务状态：TanStack Query (API 数据)
- 本地状态：React useState/Reducer

## License

MIT
