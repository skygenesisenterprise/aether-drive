<div align="center">

# 🏗️ Aether Vault Infrastructure

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-vault/blob/main/LICENSE) [![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://www.docker.com/) [![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326ce5?style=for-the-badge&logo=kubernetes)](https://kubernetes.io/) [![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis)](https://redis.io/) [![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-orange?style=for-the-badge)](https://prometheus.io/)

**🔧 Complete Infrastructure Foundation - Production-Ready Deployment with Monitoring & Caching**

A comprehensive infrastructure layer for Aether Vault that provides **production-ready deployment**, **monitoring**, **caching**, and **orchestration** capabilities. Built with **Docker**, **Kubernetes**, **Redis**, and complete **observability stack**.

[🚀 Quick Start](#-quick-start) • [📋 Components](#-components) • [🐳 Docker](#-docker) • [☸️ Kubernetes](#️-kubernetes) • [🗄️ Redis](#️-redis) • [📊 Monitoring](#-monitoring) • [🛠️ Development](#️-development)

</div>

---

## 🌟 What is Aether Vault Infrastructure?

**Aether Vault Infrastructure** is a comprehensive infrastructure foundation that provides all the necessary components for deploying, monitoring, and maintaining Aether Vault in production environments.

### 🎯 Key Components

- **🐳 Docker Containerization** - Production-ready containers with multi-stage builds
- **☸️ Kubernetes Deployment** - Cloud-native orchestration with manifests and configs
- **🗄️ Redis Caching** - High-performance caching with environment-specific configurations
- **📊 Observability Stack** - Prometheus + Grafana + Loki for complete monitoring
- **🔧 Development Environment** - Local development setups with hot reload
- **🚀 Production Deployment** - Optimized configurations for production workloads

---

## 📊 Current Status

> **✅ Production Ready**: Complete infrastructure layer with monitoring and caching.

### ✅ **Implemented Components**

#### 🐳 **Docker Infrastructure**

- ✅ **Multi-stage Dockerfiles** - Optimized builds for development and production
- ✅ **Docker Compose** - Complete orchestration for local development
- ✅ **Entry Scripts** - Configurable entry points for different environments
- ✅ **Health Checks** - Container health monitoring and readiness probes

#### ☸️ **Kubernetes Deployment**

- ✅ **Kubernetes Manifests** - Complete deployment configurations
- ✅ **Service Definitions** - Load balancing and service discovery
- ✅ **ConfigMaps & Secrets** - Configuration management
- ✅ **Ingress Configuration** - External access routing

#### 🗄️ **Redis Caching**

- ✅ **Environment-Specific Configs** - Development, testing, and production configurations
- ✅ **Performance Tuning** - Optimized Redis settings for different workloads
- ✅ **Persistence Configuration** - Data persistence and backup strategies
- ✅ **Security Settings** - Authentication and network security

#### 📊 **Monitoring & Observability**

- ✅ **Prometheus Metrics** - Comprehensive metrics collection
- ✅ **Grafana Dashboards** - Beautiful visualization and monitoring
- ✅ **Loki Logging** - Centralized log aggregation
- ✅ **Promtail Collection** - Efficient log shipping

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Docker** 20.10.0 or higher
- **Docker Compose** 2.0.0 or higher
- **Kubernetes** cluster (for production deployment)
- **kubectl** configured for your cluster
- **Helm** 3.0.0 or higher (optional, for package management)

### 🔧 Quick Development Setup

1. **Clone and navigate to infrastructure**

   ```bash
   cd infrastructure
   ```

2. **Start development environment**

   ```bash
   # Start all services with Docker Compose
   docker-compose -f docker-compose.dev.yml up -d

   # Or use the make command from root
   make docker-dev
   ```

3. **Verify services are running**

   ```bash
   # Check service status
   docker-compose -f docker-compose.dev.yml ps

   # View logs
   docker-compose -f docker-compose.dev.yml logs -f
   ```

### 🌐 Access Points

Once running, you can access:

- **Application**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:8080](http://localhost:8080)
- **Redis**: [localhost:6379](localhost:6379)
- **Grafana**: [http://localhost:3001](http://localhost:3001) (admin/admin)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)

---

## 📋 Components

### 🐳 Docker Containerization

#### **Development Environment**

```yaml
# docker-compose.dev.yml
services:
  app:
    build:
      context: ..
      dockerfile: infrastructure/docker/Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ..:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

#### **Production Environment**

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: ..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### **Dockerfiles**

- **Dockerfile** - Production-optimized multi-stage build
- **Dockerfile.dev** - Development build with hot reload
- **docker-entrypoint.sh** - Production entry script
- **docker-entrypoint-dev.sh** - Development entry script

### ☸️ Kubernetes Deployment

#### **Core Manifests**

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aether-vault
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aether-vault
  template:
    metadata:
      labels:
        app: aether-vault
    spec:
      containers:
        - name: app
          image: aether-vault:latest
          ports:
            - containerPort: 3000
```

#### **Service Configuration**

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: aether-vault-service
spec:
  selector:
    app: aether-vault
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

### 🗄️ Redis Caching

#### **Environment-Specific Configurations**

```bash
# redis-dev.conf - Development
port 6379
bind 127.0.0.1
save 900 1
save 300 10
save 60 10000

# redis-prod.conf - Production
port 6379
bind 0.0.0.0
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### **Redis Docker Service**

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
      - redis-data:/data
    command: redis-server /usr/local/etc/redis/redis.conf
```

### 📊 Monitoring Stack

#### **Prometheus Configuration**

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: "aether-vault"
    static_configs:
      - targets: ["app:3000"]
  - job_name: "redis"
    static_configs:
      - targets: ["redis:6379"]
```

#### **Grafana Dashboards**

```yaml
# monitoring/grafana/provisioning/datasources/datasources.yml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
```

#### **Log Aggregation**

```yaml
# monitoring/loki.yml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
```

---

## 🛠️ Development

### 🎯 **Development Workflow**

```bash
# Start development environment
make docker-dev

# View logs
make docker-logs

# Stop services
make docker-stop

# Rebuild containers
make docker-rebuild

# Access container shell
make docker-shell
```

### 🐳 **Docker Commands**

```bash
# Build images
docker build -f infrastructure/docker/Dockerfile.dev -t aether-vault:dev .

# Run specific service
docker-compose -f docker-compose.dev.yml up app

# Scale services
docker-compose -f docker-compose.yml up -d --scale app=3

# Clean up
docker-compose -f docker-compose.yml down -v
```

### ☸️ **Kubernetes Commands**

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=aether-vault

# View logs
kubectl logs -f deployment/aether-vault

# Scale deployment
kubectl scale deployment aether-vault --replicas=5

# Update deployment
kubectl set image deployment/aether-vault app=aether-vault:v2.0.0
```

### 📊 **Monitoring Commands**

```bash
# Access monitoring dashboards
make monitoring-up

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# View Grafana dashboards
open http://localhost:3001

# Query logs
curl -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode 'query="{job=\"aether-vault\"}"'
```

### 🗄️ **Redis Management**

```bash
# Connect to Redis CLI
docker-compose -f docker-compose.dev.yml exec redis redis-cli

# Monitor Redis
docker-compose -f docker-compose.dev.yml exec redis redis-cli MONITOR

# Check Redis info
docker-compose -f docker-compose.dev.yml exec redis redis-cli INFO

# Backup Redis data
docker-compose -f docker-compose.dev.yml exec redis redis-cli BGSAVE
```

---

## 🏗️ Production Deployment

### 🚀 **Production Setup**

1. **Environment Configuration**

   ```bash
   # Copy production environment template
   cp .env.example .env.production

   # Configure production values
   vim .env.production
   ```

2. **Build and Deploy**

   ```bash
   # Build production images
   docker build -f infrastructure/docker/Dubernetes.yml -t aether-vault:latest .

   # Deploy to production
   docker-compose -f docker-compose.yml up -d
   ```

3. **Kubernetes Production Deployment**

   ```bash
   # Apply production manifests
   kubectl apply -f k8s/

   # Wait for rollout
   kubectl rollout status deployment/aether-vault
   ```

### 🔧 **Production Monitoring**

```bash
# Enable monitoring stack
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Configure alerts
# Add alerting rules in monitoring/prometheus.yml
```

### 📋 **Health Checks**

```bash
# Check application health
curl http://localhost:3000/health

# Check service health
kubectl get pods -l app=aether-vault

# Check Redis connectivity
docker-compose -f docker-compose.yml exec redis redis-cli ping
```

---

## 📁 Directory Structure

```
infrastructure/
├── docker/                    # 🐳 Docker Configuration
│   ├── Dockerfile            # Production build
│   ├── Dockerfile.dev        # Development build
│   ├── docker-compose.yml    # Production orchestration
│   ├── docker-compose.dev.yml # Development orchestration
│   ├── docker-entrypoint.sh  # Production entry script
│   └── docker-entrypoint-dev.sh # Development entry script
├── k8s/                      # ☸️ Kubernetes Manifests
│   ├── deployment.yaml       # Application deployment
│   ├── service.yaml          # Service configuration
│   ├── configmap.yaml        # Configuration management
│   ├── ingress.yaml          # Ingress routing
│   └── README.md             # Kubernetes documentation
├── redis/                    # 🗄️ Redis Configuration
│   ├── redis.conf            # Base Redis configuration
│   ├── redis-dev.conf        # Development settings
│   ├── redis-prod.conf       # Production settings
│   ├── redis-test.conf       # Testing settings
│   └── README.md             # Redis documentation
├── monitoring/               # 📊 Monitoring Stack
│   ├── prometheus.yml        # Prometheus configuration
│   ├── grafana/              # Grafana setup
│   │   └── provisioning/    # Auto-provisioning
│   │       └── datasources/  # Data sources
│   ├── loki.yml              # Log aggregation config
│   ├── promtail.yml          # Log shipping config
│   ├── docker-compose.monitoring.yml # Monitoring stack
│   └── README.md             # Monitoring documentation
├── package.json              # Infrastructure scripts
└── README.md                 # This file
```

---

## 🔧 Configuration

### 🐳 Docker Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3000
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://user:pass@postgres:5432/aethervault
LOG_LEVEL=info
```

### ☸️ Kubernetes ConfigMaps

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aether-vault-config
data:
  NODE_ENV: "production"
  PORT: "3000"
  REDIS_URL: "redis://redis-service:6379"
```

### 🗄️ Redis Configuration

```bash
# Performance tuning
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Security
requirepass your-secure-password
```

---

## 📊 Performance & Scaling

### 🚀 **Performance Optimizations**

- **Docker Multi-stage Builds** - Minimal production images
- **Redis Caching** - High-performance data caching
- **Kubernetes HPA** - Horizontal pod autoscaling
- **Load Balancing** - Distribute traffic efficiently

### 📈 **Scaling Strategies**

```bash
# Docker Compose scaling
docker-compose -f docker-compose.yml up -d --scale app=3

# Kubernetes scaling
kubectl scale deployment aether-vault --replicas=5

# Horizontal Pod Autoscaler
kubectl autoscale deployment aether-vault --cpu-percent=70 --min=2 --max=10
```

### 🔍 **Monitoring Metrics**

- **Application Performance** - Response times, error rates
- **Resource Usage** - CPU, memory, disk, network
- **Cache Performance** - Redis hit rates, memory usage
- **Container Health** - Uptime, restarts, resource limits

---

## 🔒 Security

### 🛡️ **Security Measures**

- **Container Security** - Non-root users, read-only filesystems
- **Network Security** - Firewalls, VPN access
- **Secrets Management** - Kubernetes secrets, environment variables
- **Redis Authentication** - Password protection, TLS encryption

### 🔐 **Security Configuration**

```bash
# Docker security
USER node
RUN chmod -R 755 /app
HEALTHCHECK --interval=30s --timeout=3s --retries=3

# Redis security
requirepass ${REDIS_PASSWORD}
tls-cert-file /path/to/cert.pem
tls-key-file /path/to/key.pem
```

---

## 🤝 Contributing

We welcome contributions to the infrastructure layer! Whether you're experienced with Docker, Kubernetes, monitoring, or DevOps, there's a place for you.

### 🎯 **Areas Needing Help**

- **Docker Optimization** - Multi-stage builds, security hardening
- **Kubernetes Expertise** - Advanced manifests, Helm charts
- **Monitoring Enhancement** - Custom dashboards, alerting rules
- **Performance Tuning** - Redis optimization, scaling strategies
- **Security Hardening** - Container security, network policies
- **Documentation** - Configuration guides, deployment tutorials

### 📝 **Contribution Process**

1. **Choose an area** - Docker, Kubernetes, monitoring, or Redis
2. **Understand the structure** - Read existing configurations
3. **Create a branch** with descriptive infrastructure changes
4. **Test locally** with Docker Compose before deployment
5. **Update documentation** for any new configurations
6. **Submit a pull request** with clear testing instructions

---

## 📞 Support

### 💬 **Get Help**

- 📖 **[Infrastructure Documentation](infrastructure/)** - Detailed guides
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-vault/issues)** - Infrastructure bugs
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-vault/discussions)** - Questions and ideas
- 📧 **Email** - infra@skygenesisenterprise.com

### 🐛 **Reporting Infrastructure Issues**

When reporting infrastructure issues, please include:

- Environment details (Docker version, Kubernetes version, OS)
- Configuration files (redacted sensitive data)
- Service logs and error messages
- Steps to reproduce the issue
- Expected vs actual behavior

---

## 📊 Component Status

| Component          | Status     | Technology     | Configuration    | Notes                    |
| ------------------ | ---------- | -------------- | ---------------- | ------------------------ |
| **Docker**         | ✅ Working | Docker         | Multi-stage      | Production-ready builds  |
| **Docker Compose** | ✅ Working | Docker Compose | Dev/Prod         | Complete orchestration   |
| **Kubernetes**     | ✅ Working | K8s            | Manifests        | Full deployment support  |
| **Redis**          | ✅ Working | Redis 7        | Multi-env        | High-performance caching |
| **Prometheus**     | ✅ Working | Prometheus     | Metrics config   | Complete monitoring      |
| **Grafana**        | ✅ Working | Grafana        | Dashboards       | Beautiful visualization  |
| **Loki**           | ✅ Working | Loki           | Log aggregation  | Centralized logging      |
| **Promtail**       | ✅ Working | Promtail       | Log shipping     | Efficient log collection |
| **Health Checks**  | ✅ Working | Docker/K8s     | Readiness probes | Service monitoring       |

---

## 📄 License

This infrastructure is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Docker Team** - Container platform and tools
- **Kubernetes Community** - Orchestration platform
- **Redis Labs** - High-performance caching
- **Prometheus Team** - Monitoring and alerting
- **Grafana Labs** - Visualization platform
- **Loki Project** - Log aggregation system
- **CNCF** - Cloud Native Computing Foundation

---

<div align="center">

### 🚀 **Production-Ready Infrastructure for Aether Vault!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-vault) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-vault/issues) • [💡 Infrastructure Discussions](https://github.com/skygenesisenterprise/aether-vault/discussions)

---

**🔧 Complete Docker + Kubernetes + Monitoring + Caching Infrastructure!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building robust infrastructure for modern applications_

</div>
