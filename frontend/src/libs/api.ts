import axios from 'axios';
import { CreateOrderData, Order, OrdersResponse, OrderFilters, OrderStatus } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const buildQueryParams = (filters: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== '') params.append(key, value.toString());
  });
  return params.toString();
};

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

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}`, { status });
    return data;
  },

  retryPayment: async (id: string): Promise<Order> => {
    const { data } = await api.post(`/orders/${id}/retry-payment`);
    return data;
  },
};

export default api;
