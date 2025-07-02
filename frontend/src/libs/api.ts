import axios from 'axios';
import { CreateOrderData, Order, OrdersResponse, OrderFilters } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

// Tạo axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        if (DEBUG) console.log('API Request:', config);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        if (DEBUG) console.log('API Response:', response);
        return response;
    },
    (error) => {
        if (DEBUG) console.error('API Error:', error);
        if (error.response?.status === 401) {
            console.warn('Unauthorized - redirect to login');
            // window.location.href = '/login'; // nếu cần redirect
        }
        return Promise.reject(error);
    }
);

// Helper: chuyển object filter thành query string
const buildQueryParams = (filters: Record<string, any>): string => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== '') params.append(key, value.toString());
    });
    return params.toString();
};

// Orders API endpoints
export const ordersApi = {
    getOrders: async (filters: OrderFilters = {}): Promise<OrdersResponse> => {
        const query = buildQueryParams(filters);
        const { data } = await api.get(`/orders${query ? `?${query}` : ''}`);
        return data;
    },

    getOrderById: async (id: string): Promise<Order> => {
        const { data } = await api.get(`/orders/${id}`);
        return data.data;
    },

    createOrder: async (data: CreateOrderData): Promise<Order> => {
        const res = await api.post('/orders', data);
        return res.data;
    },

    cancelOrder: async (id: string): Promise<Order> => {
        const { data } = await api.put(`/orders/${id}/cancel`);
        return data;
    },

    retryPayment: async (id: string): Promise<Order> => {
        const { data } = await api.post(`/orders/${id}/retry-payment`);
        return data;
    },
};

export default api;
