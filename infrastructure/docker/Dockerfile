# Monolithic Multi-Service Build for Aether Vault
# Architecture: Next.js Frontend (3000) + Go Backend (8080) + PostgreSQL + Redis + Monitoring

# Stage 1: Build Go Backend
FROM golang:1.25-alpine AS backend-builder
WORKDIR /server

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy Go mod files
COPY server/go.mod server/go.sum ./
RUN go mod download

# Copy backend source code
COPY server/ ./

# Build Go backend
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./main.go

# Stage 2: Build Next.js Frontend
FROM node:20-alpine AS frontend-builder
RUN apk add --no-cache libc6-compat

# Install pnpm for workspace
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy frontend configuration and source
COPY app/package.json ./app/package.json
COPY app/tsconfig.json app/next.config.ts app/tailwind.config.js app/postcss.config.mjs ./app/
COPY app/components.json app/eslint.config.mjs ./app/
COPY app/ ./app/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend application
RUN cd app && pnpm build

# Stage 3: Production Runtime Image
FROM alpine:latest AS production

# Install runtime dependencies for all services
RUN apk --no-cache add \
    ca-certificates \
    tzdata \
    postgresql \
    postgresql-contrib \
    curl \
    su-exec \
    nodejs \
    npm \
    build-base \
    openssh \
    openssh-server \
    shadow \
    sudo \
    openssl \
    linux-pam \
    net-tools \
    procps \
    findutils \
    supervisor \
    nginx \
    redis

# Create application users and directories
RUN addgroup --system --gid 1001 aether && \
    adduser --system --uid 1001 --ingroup aether aether && \
    addgroup --system --gid 1002 ssh-users && \
    adduser --system --uid 1002 --ingroup ssh-users --shell /bin/bash ssh-user

# Create necessary directories
RUN mkdir -p /var/lib/postgresql/data \
              /var/run/postgresql \
              /var/log/postgresql \
              /app/logs \
              /app/uploads \
              /app/frontend \
              /app/backend \
              /var/log/nginx \
              /var/log/supervisor \
              /etc/supervisor/conf.d && \
    chown -R aether:aether /app /var/log && \
    chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql /var/log/postgresql

WORKDIR /app

# Copy built applications
COPY --from=backend-builder --chown=aether:aether /server/main ./backend/
COPY --from=frontend-builder --chown=aether:aether /app/app/.next/standalone ./frontend/
COPY --from=frontend-builder --chown=aether:aether /app/app/.next/static ./frontend/.next/static

# Copy configurations
COPY --chown=aether:aether server/.env.example ./backend/.env
COPY --chown=aether:aether docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=aether:aether docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY --chown=aether:aether docker/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --chown=aether:aether docker/ssh-config/sshd_config /etc/ssh/sshd_config
COPY --chown=aether:aether docker/ssh-config/vault-shell.sh /usr/local/bin/vault-shell.sh

# Set permissions
RUN chmod +x ./docker-entrypoint.sh /usr/local/bin/vault-shell.sh

# Create SSH directory and setup
RUN mkdir -p /home/ssh-user/.ssh && \
    chown -R ssh-user:ssh-users /home/ssh-user && \
    echo "ssh-user:tempPassword123" | chpasswd

# Expose ports
EXPOSE 3000 8080 2222 5432 6379 9090 3001

# Environment variables
ENV NODE_ENV=production
ENV GO_ENV=production
ENV DATABASE_PROVIDER=postgresql
ENV POSTGRES_DB=aether_vault
ENV POSTGRES_USER=aether
ENV POSTGRES_PASSWORD=vault_postgres_2024
ENV REDIS_PASSWORD=vault_redis_2024
ENV JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENV SECURITY_ENCRYPTION_KEY=your-32-character-encryption-key

# Health checks
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || curl -f http://localhost:8080/health || exit 1

# Start all services
USER aether
CMD ["./docker-entrypoint.sh"]