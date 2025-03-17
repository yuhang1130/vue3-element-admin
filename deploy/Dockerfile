FROM swr.cn-south-1.myhuaweicloud.com/lightai-ops/base-node20-nginx-pnpm8:1.0 as builder

WORKDIR /temp

#复制package到工作目录
COPY package.json package-lock.json ./

# 安装依赖
RUN npm config set registry https://registry.npmjs.org --global
RUN npm install

# 复制当前所有代码到工作目录
COPY . .

# 打包
RUN npm run build

# 再次使用基础镜像
FROM swr.cn-south-1.myhuaweicloud.com/lightai-ops/nginx:1.16.1-alpine as runner

WORKDIR /temp
ARG ENV_FLAG

# 从builder阶段复制打包后的文件
COPY --from=builder /temp/dist /temp/dist

ENV ENV_FLAG=${ENV_FLAG}
