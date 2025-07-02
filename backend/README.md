# Backend - Order Management System

## 🏗️ Kiến trúc Microservices

Hệ thống backend được xây dựng theo kiến trúc microservices bao gồm:

- **Order Service** (Port 8001): Quản lý đơn hàng
- **Payment Service** (Port 8002): Xử lý thanh toán

## 🛠️ Công nghệ sử dụng

### Order Service
- **NestJS** - Node.js framework
- **TypeORM** - ORM cho TypeScript
- **PostgreSQL** - Cơ sở dữ liệu
- **RabbitMQ** - Message queue (AMQP)
- **Nodemailer** - Gửi email
- **Class-validator** - Validation
- **JWT** - Authentication
- **Swagger** - API documentation

### Payment Service
- **NestJS** - Node.js framework
- **RabbitMQ** - Message queue
- **Microservices** pattern

## 📦 Cấu trúc dự án

```
backend/
├── docker-compose.yml          # Docker orchestration
├── order-service/             # Service quản lý đơn hàng
│   ├── src/
│   │   ├── app.module.ts      # Main module
│   │   ├── main.ts            # Entry point
│   │   ├── database/          # Database configuration
│   │   ├── exception/         # Error handling
│   │   ├── mail/              # Email service
│   │   └── orders/            # Orders domain
│   │       ├── dto/           # Data Transfer Objects
│   │       ├── entity/        # Database entities
│   │       ├── order.controller.ts
│   │       ├── order.service.ts
│   │       └── order.module.ts
│   └── Dockerfile
└── payment-service/           # Service xử lý thanh toán
    ├── src/
    │   ├── app.module.ts
    │   ├── main.ts
    │   └── payment/
    └── Dockerfile
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+

### 1. Cài đặt dependencies

```bash
# Order Service
cd order-service
npm install

# Payment Service  
cd ../payment-service
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` cho mỗi service:

**order-service/.env:**
```env
# Database
DATABASE_URL=postgres://root:password@localhost:5432/orders
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=orders

# Application
PORT=8001
NODE_ENV=development

# RabbitMQ
RABBITMQ_URL=amqp://root:password@localhost:5672

# Payment Service
PAYMENTS_URL=http://localhost:8002

# JWT
JWT_SECRET=your-secret-key

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

**payment-service/.env:**
```env
PORT=8002
NODE_ENV=development
RABBITMQ_URL=amqp://root:password@localhost:5672
```

### 3. Chạy với Docker (Khuyến nghị)

```bash
# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

### 4. Chạy trong development

```bash
# Terminal 1 - Order Service
cd order-service
npm run dev

# Terminal 2 - Payment Service
cd payment-service
npm run dev
```

## 📊 Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId VARCHAR NOT NULL,
    productName VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR NOT NULL CHECK (status IN ('created', 'confirmed', 'delivered', 'cancelled')),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🔗 API Endpoints

### Order Service (http://localhost:8001)

#### Orders
- `GET /api/v1/orders` - Lấy danh sách đơn hàng
- `GET /api/v1/orders/:id` - Chi tiết đơn hàng
- `POST /api/v1/orders` - Tạo đơn hàng mới
- `PUT /api/v1/orders/:id/cancel` - Hủy đơn hàng
- `POST /api/v1/orders/:id/retry-payment` - Thử lại thanh toán

#### Query Parameters (GET /orders)
```
page=1              # Trang hiện tại
limit=10            # Số item per page
search=keyword      # Tìm kiếm theo tên sản phẩm
status=created      # Lọc theo trạng thái
sortBy=createdAt    # Sắp xếp theo field
sortOrder=DESC      # Thứ tự sắp xếp (ASC/DESC)
```

#### Request Examples

**Tạo đơn hàng:**
```bash
curl -X POST http://localhost:8001/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "productName": "iPhone 15 Pro",
    "amount": 999.99
  }'
```

**Lấy danh sách đơn hàng:**
```bash
curl "http://localhost:8001/api/v1/orders?page=1&limit=10&status=created"
```

### Payment Service (http://localhost:8002)
- Microservice chỉ nhận message từ RabbitMQ
- Không có public API endpoints

## 🔄 Message Flow

### Luồng tạo đơn hàng:
1. **Frontend** → `POST /orders` → **Order Service**
2. **Order Service** → Save to DB (status: CREATED)
3. **Order Service** → Publish message → **RabbitMQ** → **Payment Service**
4. **Payment Service** → Process payment → Publish result → **RabbitMQ**
5. **Order Service** → Update status (CONFIRMED/CANCELLED)
6. **Order Service** → Send email notification

### Message Schemas:

**order.created:**
```json
{
  "orderId": "uuid",
  "amount": 999.99,
  "userId": "user123",
  "token": "payment_token"
}
```

**payment.result:**
```json
{
  "orderId": "uuid",
  "status": "confirmed" // or "cancelled"
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Swagger documentation có sẵn tại:
- Order Service: http://localhost:8001/api

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start with watch mode
npm run start:debug  # Start with debug mode

# Build
npm run build        # Build for production
npm run start:prod   # Start production build

# Code quality
npm run lint         # ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Prettier formatting
```

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Rebuild specific service
docker-compose build order-service

# View logs
docker-compose logs order-service
docker-compose logs payment-service

# Execute commands in containers
docker-compose exec order-service npm run test
```

## 📝 Environment Variables

### Order Service
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8001 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `RABBITMQ_URL` | RabbitMQ connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `MAIL_HOST` | SMTP host | - |
| `MAIL_USER` | SMTP username | - |
| `MAIL_PASS` | SMTP password | - |

### Payment Service
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8002 |
| `RABBITMQ_URL` | RabbitMQ connection string | - |

## 🚀 Deployment

### Production Build
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Health Checks
- Order Service: `GET http://localhost:8001/health`
- Payment Service: `GET http://localhost:8002/health`

## 🔍 Monitoring & Logging

- Logs được output theo JSON format
- Health check endpoints available
- Error tracking với global exception filters

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.
