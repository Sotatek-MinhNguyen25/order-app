import axios, { AxiosError } from 'axios';
import { CreateOrderData, Order, OrdersResponse, OrderFilters, OrderStatus } from '../types/order';
import { LoginDto, RegisterDto, RefreshTokenDto, AuthResponse, TokenResponse } from '../types/auth';
import { getAccessToken, getRefreshToken, setTokens } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(
  config => {
    const isAuthEndpoint = config.url?.includes('/auth/');
    const token = getAccessToken();
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await api.post<TokenResponse>('/auth/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data.data;

        setTokens(accessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
    return data.data;
  },
};

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};

export default api;
