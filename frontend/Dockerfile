# ===== Single-stage build - Đơn giản, chắc chắn chạy =====
FROM node:20-alpine

WORKDIR /app

# Copy package files và cài dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Build Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Chạy production server
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
