FROM node:18-alpine

WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache python3 make g++

# 复制 package.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
