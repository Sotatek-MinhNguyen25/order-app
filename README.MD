# 🛒 Order Management System

## 📋 Tổng quan dự án

**Order Management System** là một hệ thống quản lý đơn hàng hiện đại được xây dựng với kiến trúc **microservices**. Hệ thống bao gồm frontend React và backend NestJS, cung cấp giải pháp toàn diện cho việc quản lý đơn hàng và xử lý thanh toán.

## 🏗️ Kiến trúc hệ thống

```
Order Management System
├── Frontend (React + TypeScript)
│   ├── Dashboard quản lý đơn hàng
│   ├── Tạo đơn hàng mới
│   ├── Chi tiết đơn hàng
│   └── Theo dõi trạng thái
└── Backend (Microservices)
    ├── Order Service (NestJS + PostgreSQL)
    │   ├── CRUD đơn hàng
    │   ├── Quản lý trạng thái
    │   └── Gửi email thông báo
    └── Payment Service (NestJS + RabbitMQ)
        ├── Xử lý thanh toán
        └── Cập nhật trạng thái
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **React Query** - Server state management
- **React Hook Form + Zod** - Form handling & validation
- **Axios** - HTTP client

### Backend
- **NestJS** - Enterprise Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database
- **RabbitMQ** - Message queue
- **Docker** - Containerization
- **Swagger** - API documentation

## 🎯 Tính năng chính

### 📱 Frontend Features
- ✅ **Dashboard đơn hàng** với phân trang và tìm kiếm
- ✅ **Tạo đơn hàng** với form validation
- ✅ **Chi tiết đơn hàng** và timeline trạng thái
- ✅ **Responsive design** cho mobile/tablet/desktop
- ✅ **Real-time notifications** với toast messages
- ✅ **Loading states** và skeleton loading
- ✅ **Error handling** toàn diện

### 🔧 Backend Features
- ✅ **RESTful API** cho quản lý đơn hàng
- ✅ **Microservices architecture** với message queue
- ✅ **Database transactions** và data consistency
- ✅ **Email notifications** cho trạng thái đơn hàng
- ✅ **Error handling** và logging
- ✅ **API documentation** với Swagger
- ✅ **Docker deployment** ready

## 🔄 Luồng hoạt động

### Quy trình tạo đơn hàng:
1. **User** tạo đơn hàng từ frontend
2. **Order Service** lưu đơn hàng với trạng thái `CREATED`
3. **Order Service** gửi message qua **RabbitMQ** đến **Payment Service**
4. **Payment Service** xử lý thanh toán (simulation)
5. **Payment Service** gửi kết quả về **Order Service**
6. **Order Service** cập nhật trạng thái (`CONFIRMED`/`CANCELLED`)
7. **Order Service** gửi email thông báo
8. **Frontend** cập nhật UI real-time

### Trạng thái đơn hàng:
- 🔵 **CREATED** - Đơn hàng vừa được tạo
- 🟠 **CONFIRMED** - Thanh toán thành công
- 🟢 **DELIVERED** - Đã giao hàng
- 🔴 **CANCELLED** - Đã hủy đơn

## 🚀 Quick Start

### 1. Clone repository
```bash
git clone <repository-url>
```

### 2. Setup Backend
```bash
cd backend

# Chạy với Docker (Khuyến nghị)
docker-compose up -d

# Hoặc chạy manual
cd order-service && npm install && npm run dev
cd payment-service && npm install && npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Order API**: http://localhost:8001
- **Payment API**: http://localhost:8002
- **API Docs**: http://localhost:8001/api/docs

## 📁 Cấu trúc dự án

```
order-management-system/
├── README.md                   # File này
├── backend/                    # Backend microservices
│   ├── README.md              # Backend documentation
│   ├── docker-compose.yml     # Docker orchestration
│   ├── order-service/         # Service quản lý đơn hàng
│   │   ├── src/
│   │   │   ├── orders/        # Orders domain
│   │   │   ├── database/      # DB configuration
│   │   │   ├── mail/          # Email service
│   │   │   └── exception/     # Error handling
│   │   ├── Dockerfile
│   │   └── package.json
│   └── payment-service/       # Service xử lý thanh toán
│       ├── src/payment/
│       ├── Dockerfile
│       └── package.json
└── frontend/                   # React frontend
    ├── README.md              # Frontend documentation
    ├── src/
    │   ├── pages/             # Page components
    │   ├── components/        # Reusable components
    │   ├── hooks/             # Custom hooks
    │   ├── libs/              # API & utilities
    │   └── types/             # TypeScript types
    ├── package.json
    └── vite.config.ts
```

## 🔧 Development

### Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL=postgres://root:password@localhost:5432/orders

# RabbitMQ
RABBITMQ_URL=amqp://root:password@localhost:5672

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8001/api/v1
VITE_DEBUG=true
```

### Available Scripts

#### Backend
```bash
npm run dev          # Development mode
npm run build        # Build production
npm run start:prod   # Start production
npm run test         # Run tests
npm run lint         # ESLint
```

#### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # ESLint
```

## 📡 API Endpoints

### Order Service (Port 8001)
```
GET    /api/v1/orders           # Lấy danh sách đơn hàng
POST   /api/v1/orders           # Tạo đơn hàng mới
GET    /api/v1/orders/:id       # Chi tiết đơn hàng
PUT    /api/v1/orders/:id/cancel # Hủy đơn hàng
POST   /api/v1/orders/:id/retry-payment # Thử lại thanh toán
```

### Payment Service (Port 8002)
- Internal microservice communication via RabbitMQ
- No public API endpoints

## 📊 Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId VARCHAR NOT NULL,
    productName VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

```bash
# Backend tests (basic setup có sẵn)
cd backend/order-service
npm run test
npm run test:e2e

# Frontend tests (chưa có setup)
cd frontend
# npm run test (chưa có)
```

## 🚀 Production Deployment

### Prerequisites
- Docker & Docker Compose
- PostgreSQL database
- RabbitMQ server
- Email SMTP service

### Deployment Steps
1. **Setup environment variables**
2. **Build production images**
3. **Deploy with docker-compose**


## 🔐 Security

### Backend Security
- **CORS** configuration
- **Input validation** với class-validator
- **Error handling** không expose sensitive info

### Frontend Security
- **Environment variables** cho config
- **XSS protection** với React's built-in escaping
- **Input sanitization**

## 📈 Performance

### Backend Optimization
- **Connection pooling** cho PostgreSQL
- **Message queue** cho async processing

### Frontend Optimization
- **Bundle optimization** với Vite
- **Caching** với React Query

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow existing code style

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Documentation](http://localhost:8001/api/docs) (when running)

## 🐛 Troubleshooting

### Common Issues

**Backend không start:**
- Check PostgreSQL connection
- Verify environment variables
- Check port conflicts

**Frontend không connect đến API:**
- Verify VITE_API_BASE_URL
- Check CORS configuration
- Ensure backend is running

**Database connection errors:**
- Check PostgreSQL is running
- Verify DATABASE_URL format
- Check network connectivity

**RabbitMQ connection issues:**
- Ensure RabbitMQ is running
- Verify RABBITMQ_URL
- Check queue configuration

