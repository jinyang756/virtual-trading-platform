# Multi-stage Dockerfile for building and serving the web app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production=false
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
