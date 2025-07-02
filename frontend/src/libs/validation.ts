import { z } from 'zod';

// Schema validation cho CreateOrder form
export const createOrderSchema = z.object({
    userId: z
        .string()
        .min(1, 'Mã người dùng không được để trống')
        .uuid('Mã người dùng phải là UUID hợp lệ'),

    productName: z
        .string()
        .min(1, 'Tên sản phẩm không được để trống')
        .max(255, 'Tên sản phẩm không được quá 255 ký tự'),

    amount: z
        .number({
            required_error: 'Số tiền là bắt buộc',
            invalid_type_error: 'Số tiền phải là số',
        })
        .min(0, 'Số tiền phải lớn hơn hoặc bằng 0')
        .max(999999999, 'Số tiền quá lớn'),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;

// Schema cho filters
export const orderFiltersSchema = z.object({
    status: z.enum(['created', 'confirmed', 'processing', 'delivered', 'cancelled', 'declined']).optional(),
    userId: z.string().uuid().optional(),
    sortBy: z.enum(['createdAt', 'amount', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    search: z.string().optional(),
});

export type OrderFiltersFormData = z.infer<typeof orderFiltersSchema>;