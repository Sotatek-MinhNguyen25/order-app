import axios from 'axios';
import { CreateOrderData, Order, OrdersResponse, OrderFilters } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

// Tạo axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        if (import.meta.env.VITE_DEBUG === 'true') {
            console.log('API Request:', config);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.VITE_DEBUG === 'true') {
            console.log('API Response:', response);
        }
        return response;
    },
    (error) => {
        if (import.meta.env.VITE_DEBUG === 'true') {
            console.error('API Error:', error);
        }

        if (error.response?.status === 401) {
            console.log('Unauthorized - redirect to login');
        }

        return Promise.reject(error);
    }
);

// Orders API endpoints
export const ordersApi = {
    // GET /orders - Lấy danh sách đơn hàng
    getOrders: async (filters: OrderFilters = {}): Promise<OrdersResponse> => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        const response = await api.get(`/orders?${params.toString()}`);
        return response.data; // Backend trả về { status, message, data, meta }
    },

    getOrderById: async (orderId: string): Promise<Order> => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data.data || response.data;
    },


    // POST /orders - Tạo đơn hàng mới
    createOrder: async (data: CreateOrderData): Promise<Order> => {
        const response = await api.post('/orders', data);
        return response.data.data || response.data;
    },

    // PUT /orders/:id/status - Cập nhật trạng thái đơn hàng
    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data.data || response.data;
    },

    // PUT /orders/:orderId/cancel - Hủy đơn hàng
    cancelOrder: async (id: string): Promise<Order> => {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data.data || response.data;
    },

    // POST /orders/:orderId/retry-payment - Thử lại thanh toán
    retryPayment: async (id: string): Promise<Order> => {
        const response = await api.post(`/orders/${id}/retry-payment`);
        return response.data.data || response.data;
    },
};

export default api;