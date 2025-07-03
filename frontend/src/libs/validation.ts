import { z } from 'zod';

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
