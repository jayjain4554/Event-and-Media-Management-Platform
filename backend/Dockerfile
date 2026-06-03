# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Step 2: Production Stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
# Create directories for upload storage and logs
RUN mkdir -p public/uploads logs

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
