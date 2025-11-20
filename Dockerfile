# Build frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" && \
    if [ -n "$VITE_SUPABASE_ANON_KEY" ]; then \
      echo "VITE_SUPABASE_ANON_KEY length: ${#VITE_SUPABASE_ANON_KEY}"; \
    else \
      echo "VITE_SUPABASE_ANON_KEY is empty"; \
    fi && \
    npm run build

# Build backend
FROM node:20-slim AS backend-builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/prisma ./prisma
RUN npm install
RUN npm run prisma:generate

COPY server/src ./src
COPY --from=frontend-builder /app/frontend/build ./client
RUN npm run build

# Production image
FROM node:20-slim AS production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/client ./client
COPY server/prisma ./prisma
COPY server/package*.json ./
COPY server/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

ENV PORT=7860
EXPOSE 7860
CMD ["./entrypoint.sh"]
