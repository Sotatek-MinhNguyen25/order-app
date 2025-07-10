import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(100, 'Mật khẩu quá dài'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100, 'Tên quá dài'),
  email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(100, 'Mật khẩu quá dài'),
});

export const createOrderSchema = z.object({
  userId: z.string().min(1, 'Mã người dùng không được để trống').uuid('UUID không hợp lệ'),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống').max(255, 'Tên quá dài'),
  amount: z.number().min(0, 'Số tiền phải >= 0').max(999999999, 'Số tiền quá lớn'),
});

export const orderFiltersSchema = z.object({
  status: z
    .enum(['created', 'confirmed', 'processing', 'delivered', 'cancelled', 'declined'])
    .optional(),
  userId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'amount', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type OrderFiltersFormData = z.infer<typeof orderFiltersSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
