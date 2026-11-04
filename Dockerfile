# ==============================================================================
# CHECKPOINT TECHNICAL — PRODUCTION DOCKERFILE (MULTI-STAGE BUILD)
# ==============================================================================

# Stage 1: Build & Compile TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt toàn bộ dependencies (bao gồm devDependencies để compile NestJS & TypeScript)
COPY package*.json ./
RUN npm ci || npm install

# Sao chép mã nguồn và thực thi build
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATA_DIR=/app/data

# Cài đặt chỉ production dependencies để tối ưu kích thước image
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Sao chép các tệp artifacts sau khi biên dịch từ builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config

# Khởi tạo thư mục dữ liệu cục bộ dự phòng (Hybrid Fallback Storage)
RUN mkdir -p /app/data && chmod 777 /app/data

# Mở cổng dịch vụ của ứng dụng
EXPOSE 3001

# Lệnh khởi chạy chính thức của hệ thống NestJS
CMD ["node", "dist/main.js"]
