// Generic API Response types
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request config type
export interface RequestConfig {
  url?: string;
  method?: HttpMethod;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}
