# Build stage
FROM node:20-slim AS builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package*.json tsconfig.json .
COPY prisma ./prisma
RUN npm install
RUN npm run prisma:generate

COPY src ./src
RUN npm run build

# Production stage
FROM node:20-slim AS production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY prisma ./prisma
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 5000
CMD ["./entrypoint.sh"]
