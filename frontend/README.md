# Frontend - Order Management System

## 🎨 Giao diện quản lý đơn hàng

Ứng dụng web hiện đại được xây dựng với React và TypeScript, cung cấp giao diện trực quan để quản lý đơn hàng.

## 🛠️ Công nghệ sử dụng

### Core Technologies
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **React Router Dom** - Client-side Routing

### Styling & UI
- **TailwindCSS** - Utility-first CSS Framework
- **Lucide React** - Icon Library
- **CLSX** - Conditional Classes

### State Management & Data Fetching
- **React Query** - Server State Management
- **React Hook Form** - Form Management
- **Zod** - Schema Validation

### HTTP Client
- **Axios** - HTTP Client với interceptors

### User Experience
- **React Hot Toast** - Toast Notifications
- **Loading States** - Skeleton loading
- **Error Boundaries** - Error Handling

## 📦 Cấu trúc dự án

```
frontend/
├── public/
│   └── vite.svg                # Static assets
├── src/
│   ├── assets/                 # Images, icons
│   ├── components/             # Reusable components
│   │   └── index.ts           # Barrel exports
│   ├── hooks/                  # Custom hooks
│   │   ├── useOrders.ts       # Orders data fetching
│   │   ├── useOrderDetail.ts  # Single order data
│   │   └── index.ts
│   ├── layouts/                # Layout components
│   │   ├── MainLayout.tsx     # Main app layout
│   │   └── index.ts
│   ├── libs/                   # Utilities & configurations
│   │   ├── api.ts             # Axios instance & API calls
│   │   ├── utils.ts           # Helper functions
│   │   ├── validation.ts      # Zod schemas
│   │   └── index.ts
│   ├── pages/                  # Page components
│   │   ├── OrdersDashboard.tsx # Main orders list
│   │   ├── CreateOrder.tsx    # Create order form
│   │   ├── OrderDetail.tsx    # Order details page
│   │   ├── NotFound.tsx       # 404 page
│   │   └── index.ts
│   ├── providers/              # Context providers
│   │   ├── QueryProvider.tsx  # React Query setup
│   │   └── index.ts
│   ├── types/                  # TypeScript definitions
│   │   ├── api.ts             # API response types
│   │   ├── order.ts           # Order-related types
│   │   └── index.ts
│   ├── App.tsx                 # Main App component
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # Vite type definitions
├── index.html                  # HTML template
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # TailwindCSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # This file
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục frontend:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8001/api/v1

# Development
VITE_DEBUG=true

# Optional: Analytics, etc.
# VITE_GA_ID=your-google-analytics-id
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### 4. Build cho production

```bash
npm run build
npm run preview  # Preview production build
```

## 🎯 Tính năng chính

### 📋 Dashboard Đơn hàng (`/orders`)
- **Danh sách đơn hàng** với phân trang
- **Tìm kiếm** theo tên sản phẩm
- **Lọc** theo trạng thái đơn hàng
- **Sắp xếp** theo ngày tạo, giá trị
- **Refresh** data realtime
- **Status badges** với màu sắc phân biệt

### ➕ Tạo đơn hàng (`/orders/create`)
- **Form validation** với Zod schema
- **Real-time validation** feedback
- **Loading states** khi submit
- **Success/Error notifications**
- **Auto redirect** sau khi tạo thành công

### 📄 Chi tiết đơn hàng (`/orders/:id`)
- **Thông tin chi tiết** đơn hàng
- **Timeline trạng thái** đơn hàng
- **Actions**: Hủy đơn, thử lại thanh toán
- **Loading skeleton** khi fetch data

### 🔍 Tìm kiếm & Lọc
- Tìm kiếm theo tên sản phẩm
- Lọc theo trạng thái: Created, Confirmed, Delivered, Cancelled
- Phân trang với navigation
- Sắp xếp ASC/DESC

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first** approach
- **Tablet & desktop** optimized
- **Flexible grid** layouts

### Loading States
- **Skeleton loading** cho danh sách
- **Button loading** khi submit
- **Page loading** khi navigate

### Error Handling
- **Toast notifications** cho success/error
- **Form validation** messages
- **API error** handling
- **404 page** cho routes không tồn tại

### User Experience
- **Intuitive navigation** với breadcrumbs
- **Consistent styling** across pages
- **Smooth transitions** và animations
- **Keyboard accessibility**

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev          # Start dev server với hot reload
npm run build        # Build cho production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# TailwindCSS
npm run tw:watch     # Watch TailwindCSS changes
```

## 📡 API Integration

### Axios Configuration
```typescript
// Base URL từ environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';



### API Endpoints Usage
```typescript
// Lấy danh sách đơn hàng
const orders = await ordersApi.getOrders({
  page: 1,
  limit: 10,
  status: 'created'
});

// Tạo đơn hàng mới
const newOrder = await ordersApi.createOrder({
  userId: 'user123',
  productName: 'iPhone 15',
  amount: 999.99
});
```

## 🧪 Testing

```bash
# Unit tests (nếu có setup)
npm run test

# E2E tests (nếu có setup)
npm run test:e2e
```

## 🚀 Deployment

### Build cho Production
```bash
npm run build
npm run preview
```

### Environment Variables cho Production
```env
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
VITE_DEBUG=false
```

## 🔍 Performance Optimization

- **Code splitting** với React.lazy
- **Image optimization** với Vite
- **Bundle analysis** với rollup-plugin-analyzer
- **Caching** với React Query
- **Memoization** với React.memo, useMemo

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request
