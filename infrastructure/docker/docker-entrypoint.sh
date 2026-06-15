#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Aether Vault...${NC}"
echo -e "${BLUE}📍 Environment: $NODE_ENV${NC}"
echo -e "${BLUE}🗄️  Database Provider: $DATABASE_PROVIDER${NC}"
echo -e "${BLUE}🔐 SSH Port: $SSH_PORT${NC}"
if [ -n "$DATABASE_URL" ]; then
    echo -e "${BLUE}🔗 Database URL: $(echo $DATABASE_URL | sed 's|://.*@|://***:***@|')${NC}"
fi

#############################################
# Setup Environment Variables
#############################################
setup_env() {
    # Database Configuration
    export POSTGRES_DB=aether_vault
    export POSTGRES_USER=aether
    export POSTGRES_HOST=localhost
    export POSTGRES_PORT=5432
    export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-aether_postgres_2024}
    export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB"

    # Backend Configuration
    export SERVER_HOST=0.0.0.0
    export SERVER_PORT=8080
    export SERVER_ENVIRONMENT=${NODE_ENV:-production}
    
    # Frontend Configuration
    export FRONTEND_PORT=3000
    export NODE_ENV=${NODE_ENV:-production}
    export BACKEND_URL=http://localhost:$SERVER_PORT
    export API_BASE_URL=http://localhost:$SERVER_PORT
    export NEXTAUTH_URL=http://localhost:3000
    export NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-your-super-secret-nextauth-key-change-in-production}
    
    # Security Configuration
    export JWT_SECRET=${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
    export JWT_EXPIRATION_HOURS=24
    export SECURITY_ENCRYPTION_KEY=${SECURITY_ENCRYPTION_KEY:-your-32-character-encryption-key}
    export SECURITY_KDF_ITERATIONS=100000
    export SERVER_READ_TIMEOUT=30
    export SERVER_WRITE_TIMEOUT=30
    
    # Redis Configuration
    export REDIS_HOST=localhost
    export REDIS_PORT=6379
    export REDIS_PASSWORD=${REDIS_PASSWORD:-aether_redis_2024}
    export REDIS_DB=0
    
    # SSH Configuration
    export SSH_AUTH_SERVICE_URL=${SSH_AUTH_SERVICE_URL:-""}
    export SSH_ENABLE_LOCAL_AUTH=${SSH_ENABLE_LOCAL_AUTH:-true}
    export SSH_USER=aether-user
    export SSH_PORT=${SSH_PORT:-2222}
    
    # Determine frontend HOST based on environment
    if [ "$NODE_ENV" = "development" ] || [ -n "$LOCAL_ACCESS" ]; then
        export HOST=0.0.0.0  # Allow both localhost and domain access in dev
        echo -e "${YELLOW}🔧 Frontend configured for dual access (localhost + domain)${NC}"
    else
        export HOST=0.0.0.0  # Bind to all interfaces for domain access
        echo -e "${YELLOW}🔧 Frontend configured for domain access${NC}"
    fi

    echo -e "${GREEN}✅ Environment configured${NC}"
}

#############################################
# Function to wait for service
#############################################
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service_name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if eval "$check_command" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts: $service_name not ready yet${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service_name failed to start${NC}"
    return 1
}

#############################################
# Initialize directories and permissions
#############################################
init_directories() {
    echo -e "${BLUE}📁 Initializing directories and permissions...${NC}"
    
    # Create all necessary directories
    mkdir -p /var/lib/postgresql/data \
              /var/run/postgresql \
              /var/log/postgresql \
              /app/logs \
              /app/uploads \
              /var/log/nginx \
              /var/log/supervisor \
              /etc/supervisor/conf.d \
              /home/ssh-user/.ssh
    
    # Set proper ownership
    chown -R aether:aether /app /home/ssh-user
    chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql /var/log/postgresql
    
    echo -e "${GREEN}✅ Directories initialized${NC}"
}

#############################################
# Start PostgreSQL
#############################################
start_postgres() {
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        echo -e "${BLUE}🐘 Starting PostgreSQL on internal port $POSTGRES_PORT...${NC}"
        
        if [ "$(id -u)" = "0" ]; then
            # Start as root with user switch
            chown -R postgres:postgres /var/lib/postgresql/data
            
            if [ ! -s /var/lib/postgresql/data/PG_VERSION ]; then
                echo -e "${YELLOW}⚡ Initializing PostgreSQL database...${NC}"
                su-exec postgres initdb -D /var/lib/postgresql/data
            fi
            
            # Start postgres in background
            su-exec postgres postgres -D /var/lib/postgresql/data &
            POSTGRES_PID=$!
        else
            echo -e "${RED}❌ PostgreSQL must be started as root${NC}"
            return 1
        fi

        # Wait for PostgreSQL to be ready
        wait_for_service "PostgreSQL" "pg_isready -h localhost -p $POSTGRES_PORT -U $POSTGRES_USER" 30

        # Create database if not exists
        su-exec postgres createdb -h localhost -p "$POSTGRES_PORT" -U "$POSTGRES_USER" "$POSTGRES_DB" 2>/dev/null || true
        
        echo -e "${GREEN}✅ PostgreSQL started successfully (PID $POSTGRES_PID)${NC}"
        echo $POSTGRES_PID > /app/postgres.pid
    fi
}

#############################################
# Start Redis
#############################################
start_redis() {
    echo -e "${BLUE}🔴 Starting Redis on internal port $REDIS_PORT...${NC}"
    
    # Start Redis in background
    redis-server --daemonize yes --appendonly yes --requirepass $REDIS_PASSWORD --port $REDIS_PORT &
    REDIS_PID=$!
    
    # Wait for Redis to be ready
    wait_for_service "Redis" "redis-cli -a $REDIS_PASSWORD ping" 20
    
    echo -e "${GREEN}✅ Redis started successfully (PID $REDIS_PID)${NC}"
    echo $REDIS_PID > /app/redis.pid
}

#############################################
# Start Go Backend
#############################################
start_backend() {
    echo -e "${BLUE}⚡ Starting Aether Vault API Server on internal port $SERVER_PORT...${NC}"
    cd /app
    
    # Start backend in background
    ./server/main > /app/logs/backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to be ready
    wait_for_service "Backend API" "curl -f http://localhost:$SERVER_PORT/health" 30
    
    echo -e "${GREEN}✅ Backend running (PID $BACKEND_PID)${NC}"
    echo $BACKEND_PID > /app/backend.pid
}

#############################################
# Start Frontend (Next.js + Caddy)
#############################################
#############################################
# Start SSH Server
#############################################
start_ssh() {
    echo -e "${BLUE}🔐 Starting SSH Server on port $SSH_PORT...${NC}"
    
    if [ "$(id -u)" = "0" ]; then
        # Ensure proper permissions
        mkdir -p /var/run/sshd
        chmod 0755 /var/run/sshd
        
        # Generate SSH host keys if they don't exist
        if [ ! -f /etc/ssh/ssh_host_rsa_key ]; then
            echo -e "${YELLOW}🔑 Generating SSH host keys...${NC}"
            ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N "" > /dev/null 2>&1
            ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N "" > /dev/null 2>&1
        fi
        
        # Setup SSH user
        echo "ssh-user:tempPassword123" | chpasswd
        
        # Start SSH daemon
        /usr/sbin/sshd -D -e /etc/ssh/sshd_config &
        SSH_PID=$!
        
        # Wait for SSH to be ready
        wait_for_service "SSH Server" "nc -z localhost $SSH_PORT" 10
        
        echo -e "${GREEN}✅ SSH server running on port $SSH_PORT (PID $SSH_PID)${NC}"
        echo $SSH_PID > /app/ssh.pid
    else
        echo -e "${RED}❌ SSH server requires root privileges${NC}"
        return 1
    fi
}

#############################################
# Start Next.js Frontend
#############################################
start_frontend() {
    echo -e "${BLUE}🌐 Starting Next.js Frontend...${NC}"
    cd /app/frontend
    
    # Start frontend in background
    NODE_ENV=production HOST=$HOST PORT=3000 node server.js > /app/logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    wait_for_service "Frontend" "curl -f http://localhost:3000" 30
    
    echo -e "${GREEN}✅ Frontend running with HOST=$HOST on port 3000 (PID $FRONTEND_PID)${NC}"
    echo $FRONTEND_PID > /app/frontend.pid
}

#############################################
# Setup Nginx Reverse Proxy
#############################################
start_nginx() {
    echo -e "${BLUE}🌐 Starting Nginx reverse proxy...${NC}"
    
    # Start nginx in background
    nginx -g "daemon off; error_log /var/log/nginx/error.log warn; access_log /var/log/nginx/access.log;" &
    NGINX_PID=$!
    
    # Wait for nginx to be ready
    wait_for_service "Nginx" "curl -f http://localhost" 10
    
    echo -e "${GREEN}✅ Nginx reverse proxy running (PID $NGINX_PID)${NC}"
    echo $NGINX_PID > /app/nginx.pid
}

#############################################
# Health Checks
#############################################
health_check() {
    echo -e "${BLUE}🔍 Performing comprehensive health checks...${NC}"
    
    local all_healthy=true
    
    # Check PostgreSQL
    if pg_isready -h localhost -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL OK${NC}"
    else
        echo -e "${RED}❌ PostgreSQL not responding${NC}"
        all_healthy=false
    fi
    
    # Check Redis
    if redis-cli -a $REDIS_PASSWORD ping >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis OK${NC}"
    else
        echo -e "${RED}❌ Redis not responding${NC}"
        all_healthy=false
    fi
    
    # Check Backend API
    if curl -s http://localhost:$SERVER_PORT/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend API OK${NC}"
    else
        echo -e "${RED}❌ Backend API not responding${NC}"
        all_healthy=false
    fi
    
    # Check Frontend
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend OK${NC}"
    else
        echo -e "${RED}❌ Frontend not responding${NC}"
        all_healthy=false
    fi
    
    # Check SSH service
    if nc -z localhost $SSH_PORT 2>/dev/null; then
        echo -e "${GREEN}✅ SSH Server OK${NC}"
    else
        echo -e "${RED}❌ SSH Server not responding${NC}"
        all_healthy=false
    fi
    
    if [ "$all_healthy" = "true" ]; then
        echo -e "${GREEN}✅ All health checks passed${NC}"
        return 0
    else
        echo -e "${RED}❌ Some services failed health checks${NC}"
        return 1
    fi
}

#############################################
# Setup log rotation
#############################################
setup_log_rotation() {
    echo -e "${BLUE}📝 Setting up log rotation...${NC}"
    cat > /etc/logrotate.d/aether-vault << EOF
/app/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 aether aether
}
EOF
}

#############################################
# Service Status Display
#############################################
display_status() {
    echo -e "${GREEN}🎉 Aether Vault is fully operational!${NC}"
    echo -e "${BLUE}┌─────────────────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│ Service URLs:                                     │${NC}"
    echo -e "${BLUE}│ • Frontend:  http://localhost:3000               │${NC}"
    echo -e "${BLUE}│ • Backend:   http://localhost:8080/health         │${NC}"
    echo -e "${BLUE}│ • SSH:       ssh aether-user@localhost -p $SSH_PORT   │${NC}"
    echo -e "${BLUE}└─────────────────────────────────────────────────────────┘${NC}"
}

#############################################
# Service Monitoring
#############################################
monitor_services() {
    echo -e "${BLUE}🔍 Monitoring services...${NC}"
    while true; do
        # Check if critical services are still running
        if [ -f /app/backend.pid ] && ! kill -0 $(cat /app/backend.pid) 2>/dev/null; then
            echo -e "${RED}❌ Backend service died, restarting...${NC}"
            start_backend
        fi
        
        if [ -f /app/frontend.pid ] && ! kill -0 $(cat /app/frontend.pid) 2>/dev/null; then
            echo -e "${RED}❌ Frontend service died, restarting...${NC}"
            start_frontend
        fi
        
        if [ -f /app/redis.pid ] && ! kill -0 $(cat /app/redis.pid) 2>/dev/null; then
            echo -e "${RED}❌ Redis service died, restarting...${NC}"
            start_redis
        fi
        
        sleep 30
    done
}

#############################################
# Cleanup
#############################################
cleanup() {
    echo -e "${YELLOW}🛑 Shutting down services...${NC}"
    
    # Stop services gracefully
    if [ -f /app/frontend.pid ]; then
        kill $(cat /app/frontend.pid) 2>/dev/null || true
        echo -e "${GREEN}✅ Frontend service stopped${NC}"
    fi
    
    if [ -f /app/backend.pid ]; then
        kill $(cat /app/backend.pid) 2>/dev/null || true
        echo -e "${GREEN}✅ Backend service stopped${NC}"
    fi
    
    if [ -f /app/redis.pid ]; then
        kill $(cat /app/redis.pid) 2>/dev/null || true
        echo -e "${GREEN}✅ Redis service stopped${NC}"
    fi
    
    if [ -f /app/ssh.pid ]; then
        kill $(cat /app/ssh.pid) 2>/dev/null || true
        echo -e "${GREEN}✅ SSH service stopped${NC}"
    fi
    
    # Stop PostgreSQL
    if [ "$(id -u)" = "0" ]; then
        if [ -f /app/postgres.pid ]; then
            kill $(cat /app/postgres.pid) 2>/dev/null || true
            echo -e "${GREEN}✅ PostgreSQL service stopped${NC}"
        fi
        # Graceful shutdown
        su-exec postgres pg_ctl -D /var/lib/postgresql/data stop
    fi
    
    # Stop Redis gracefully
    redis-cli -a $REDIS_PASSWORD shutdown 2>/dev/null || true
    
    echo -e "${GREEN}✅ All services stopped gracefully${NC}"
    exit 0
}

trap cleanup SIGTERM SIGINT

#############################################
# Main
#############################################
echo "🏗️  Architecture Overview:"
if [ "$NODE_ENV" = "development" ] || [ -n "$LOCAL_ACCESS" ]; then
    echo "  🌐 Frontend: http://localhost:$FRONTEND_PORT (local development)"
    echo "  🌐 Frontend: http://mailer.skygenesisenterprise.com:$FRONTEND_PORT (domain access)"
else
    echo "  🌐 Frontend: http://0.0.0.0:$FRONTEND_PORT (domain access)"
fi
echo "  🔧 Backend: http://localhost:$SERVER_PORT"
echo "  🐘 PostgreSQL: localhost:$POSTGRES_PORT"
echo "  🔐 SSH: ssh ssh-user@localhost -p $SSH_PORT"
echo ""

setup_env
start_postgres
sleep 5
start_backend
start_ssh
start_frontend
sleep 5
health_check

echo ""
echo "🎉 Aether Mailer is ready!"
echo "🌐 Frontend accessible:"
if [ "$NODE_ENV" = "development" ] || [ -n "$LOCAL_ACCESS" ]; then
    echo "    - Local: http://localhost:$FRONTEND_PORT"
    echo "    - Domain: http://mailer.skygenesisenterprise.com:$FRONTEND_PORT"
else
    echo "    - Domain: http://mailer.skygenesisenterprise.com:$FRONTEND_PORT"
fi
echo "🔐 SSH Access: ssh ssh-user@localhost -p $SSH_PORT"
echo "Press Ctrl+C to stop all services"

wait
