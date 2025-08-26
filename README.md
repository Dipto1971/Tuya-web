# 🚀 Energy Monitoring System

A modern, full-stack energy monitoring application built with Next.js, featuring real-time device control, data analytics, and comprehensive infrastructure management.

## 🏗️ Project Structure

```
Tuya-web/
├── src/                          # Next.js Application
│   ├── app/
│   │   ├── api/                  # API Routes (Backend)
│   │   │   ├── device-status/    # Real-time device status
│   │   │   ├── switch/           # Device control
│   │   │   ├── switch-status/    # Switch state
│   │   │   ├── today-consumption/# Energy consumption data
│   │   │   ├── today-data/       # Chart data
│   │   │   ├── sse/              # Server-Sent Events
│   │   │   └── ws/               # WebSocket placeholder
│   │   ├── components/           # React Components
│   │   │   ├── DeviceControl.jsx
│   │   │   ├── TodayCost.jsx
│   │   │   ├── Todaykwh.jsx
│   │   │   └── ui/               # UI Components
│   │   └── lib/                  # Utility Libraries
│   │       ├── tuya.js           # Tuya API Integration
│   │       └── mongodb.js        # Database Operations
│   └── ...
├── infrastructure/               # Infrastructure Configuration
│   ├── nginx/                    # Nginx Configuration
│   │   └── nginx.conf
│   ├── prometheus/               # Monitoring Configuration
│   │   └── prometheus.yml
│   └── grafana/                  # Visualization Setup
│       └── provisioning/
│           ├── datasources/
│           └── dashboards/
├── docker-compose.yml            # Complete Infrastructure Stack
├── init-mongo.js                 # Database Initialization
├── start.sh                      # Service Management Script
├── .env                          # Infrastructure Environment
├── .env.local                    # Application Environment
└── package.json                  # Next.js Dependencies
```

## 🚀 Quick Start

### **1. Start Infrastructure Services:**

```bash
# Start all Docker services (MongoDB, Redis, Grafana, etc.)
./start.sh start
```

### **2. Start Next.js Application:**

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

### **3. Access the Application:**

- **Main App**: http://localhost:3000
- **MongoDB Admin**: http://localhost:8081 (admin/tuya123)
- **Grafana**: http://localhost:3001 (admin/tuya123)
- **Prometheus**: http://localhost:9090

## 🐳 Infrastructure Services

| Service             | Port   | Purpose              | Status     |
| ------------------- | ------ | -------------------- | ---------- |
| **Next.js App**     | 3000   | Main Application     | ✅ Running |
| **MongoDB**         | 27017  | Primary Database     | ✅ Running |
| **MongoDB Express** | 8081   | Database Admin UI    | ✅ Running |
| **Redis**           | 6379   | Caching & Sessions   | ✅ Running |
| **PostgreSQL**      | 5432   | Alternative Database | ✅ Running |
| **pgAdmin**         | 8082   | PostgreSQL Admin UI  | ✅ Running |
| **InfluxDB**        | 8086   | Time-series Data     | ✅ Running |
| **Grafana**         | 3001   | Data Visualization   | ✅ Running |
| **Prometheus**      | 9090   | Monitoring           | ✅ Running |
| **Node Exporter**   | 9100   | System Metrics       | ✅ Running |
| **Nginx**           | 80/443 | Reverse Proxy        | ✅ Running |

## 🔧 API Endpoints

### **Device Management:**

- `GET /api/device-status` - Fetch real-time device status
- `GET /api/switch-status` - Get current switch state
- `POST /api/switch` - Control device switch

### **Data Analytics:**

- `GET /api/today-consumption` - Today's energy consumption
- `GET /api/today-data` - Chart data for today
- `GET /api/sse` - Server-Sent Events for real-time updates

## 🔐 Environment Configuration

### **Application Environment (.env.local):**

```env
# Tuya API Configuration
TUYA_CLIENT_ID=your_tuya_client_id_here
TUYA_CLIENT_SECRET=your_tuya_client_secret_here
TUYA_API_REGION=eu1
TUYA_DEVICE_ID=your_device_id_here

# Database Configuration
MONGO_URI=mongodb://admin:tuya123@localhost:27017/tuya?authSource=admin

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Application Configuration
NODE_ENV=development
```

### **Infrastructure Environment (.env):**

```env
# Database Configuration
MONGO_URI=mongodb://admin:tuya123@localhost:27017/tuya?authSource=admin
POSTGRES_URI=postgresql://tuya_user:tuya123@localhost:5432/tuya_alt
REDIS_URI=redis://localhost:6379

# InfluxDB Configuration
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=tuya-admin-token-123
INFLUXDB_ORG=tuya-org
INFLUXDB_BUCKET=energy-data

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Docker Compose Configuration
COMPOSE_PROJECT_NAME=tuya-web
COMPOSE_FILE=docker-compose.yml
```

## 🛠️ Management Commands

### **Infrastructure Management:**

```bash
./start.sh start      # Start all services
./start.sh stop       # Stop all services
./start.sh restart    # Restart all services
./start.sh status     # Check service status
./start.sh health     # Health check
./start.sh logs       # View logs
./start.sh reset      # Reset everything
```

### **Application Management:**

```bash
npm run dev          # Development mode
npm run build        # Production build
npm run start        # Production mode
npm run lint         # Code linting
```

## 📊 Database Schema

### **MongoDB Collections:**

- `device_data` - Real-time device status data
- `users` - User accounts and preferences
- `devices` - Device configurations
- `energy_consumption` - Daily energy consumption summaries
- `system_logs` - Application and system logs

### **Indexes:**

- `device_data`: `timestamp`, `deviceId + timestamp`, `status.code`
- `energy_consumption`: `date`, `deviceId + date`
- `system_logs`: `timestamp`, `level + timestamp`

## 📈 Monitoring & Observability

### **Grafana Dashboards:**

- System Overview
- Energy Consumption Analytics
- Device Performance Metrics
- Database Performance

### **Prometheus Metrics:**

- System metrics from Node Exporter
- Application metrics
- Database performance metrics
- Custom Tuya Alternative metrics

## 🔒 Security Features

### **Nginx Security:**

- Rate limiting for API endpoints
- Basic authentication for admin interfaces
- Security headers
- SSL/TLS support (configured but commented out)

### **Database Security:**

- MongoDB authentication enabled
- PostgreSQL authentication enabled
- Redis authentication (optional)

## 🧪 Testing

### **API Testing:**

```bash
# Test device status
curl http://localhost:3000/api/device-status

# Test today's consumption
curl http://localhost:3000/api/today-consumption

# Test today's data
curl http://localhost:3000/api/today-data
```

### **Health Checks:**

```bash
# Check infrastructure health
./start.sh health

# Check service status
./start.sh status
```

## 🚀 Production Deployment

### **Environment Setup:**

1. Update `.env.local` with production values
2. Configure SSL certificates in `infrastructure/nginx/ssl/`
3. Update domain names in configurations
4. Set production environment variables

### **Build and Deploy:**

```bash
# Build the application
npm run build

# Start production mode
npm run start

# Or use Docker for production
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Development

### **Adding New API Routes:**

1. Create new folder in `src/app/api/`
2. Add `route.js` file with GET/POST handlers
3. Import necessary utilities from `src/lib/`
4. Test the endpoint

### **Adding New Components:**

1. Create component in `src/app/components/`
2. Import and use in pages
3. Add any necessary styling

### **Database Operations:**

1. Use functions from `src/lib/mongodb.js`
2. Add new collections in `init-mongo.js`
3. Update indexes for performance

## 📝 Troubleshooting

### **Common Issues:**

1. **MongoDB Connection Error:**

   ```bash
   # Check if MongoDB is running
   ./start.sh status

   # Check MongoDB logs
   ./start.sh logs mongodb
   ```

2. **Port Conflicts:**

   ```bash
   # Check what's using a port
   sudo netstat -tlnp | grep :3000
   ```

3. **Service Not Starting:**
   ```bash
   # Check service logs
   ./start.sh logs [service-name]
   ```

### **Reset Everything:**

```bash
# Stop and remove everything
./start.sh reset

# Start fresh
./start.sh start
npm run dev
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `./start.sh health`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Ready to Monitor Energy!** Start the infrastructure with `./start.sh start` and the application with `npm run dev`.
