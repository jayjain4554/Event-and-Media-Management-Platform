# Step 1: Build React application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
COPY src ./src

RUN npm run build

# Step 2: Serve React assets via Nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle SPA routing redirects
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
