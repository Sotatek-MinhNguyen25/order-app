// Enum trạng thái đơn hàng
export enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Enum sắp xếp
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Đơn hàng
export interface Order {
  id: string;
  userId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  statusDescription?: string;
  timeline?: {
    status: string;
    time?: string;
    active: boolean;
    completed: boolean;
  }[];
}

// Dữ liệu tạo đơn hàng
export interface CreateOrderData {
  userId: string;
  productName: string;
  amount: number;
}

// Bộ lọc danh sách đơn hàng
export interface OrderFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: OrderStatus;
}

// Phân trang
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Response danh sách đơn hàng
export interface OrdersResponse {
  status: number;
  message: string;
  data: Order[];
  meta: PaginationMeta;
}

// Response chi tiết đơn hàng
export interface OrderResponse {
  status?: number;
  message?: string;
  data?: Order;
}

// Error response từ backend
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
