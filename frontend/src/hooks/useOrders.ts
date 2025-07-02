import { useQuery, useMutation, useQueryClient, UseQueryResult } from 'react-query';
import { ordersApi } from '../libs/api';
import { OrderFilters, CreateOrderData, Order } from '../types/order';
import toast from 'react-hot-toast';

// Query key helpers
const ordersQueryKey = (filters: OrderFilters) => ['orders', filters];

// Hook: lấy danh sách đơn hàng
export const useOrders = (
    filters: OrderFilters = {}
): UseQueryResult<{ data: Order[]; meta: any }, unknown> => {
    return useQuery(
        ordersQueryKey(filters),
        () => ordersApi.getOrders(filters),
        {
            keepPreviousData: true,
            onError: (error: any) => {
                const message = error?.response?.data?.message || 'Lỗi khi tải danh sách đơn hàng';
                toast.error(message);
            },
        }
    );
};

// Hook: tạo đơn hàng mới
export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation(ordersApi.createOrder, {
        onSuccess: (newOrder: Order) => {
            toast.success('Đơn hàng được tạo thành công!');
            // Refetch danh sách đơn hàng
            queryClient.invalidateQueries('orders');
            // Optional: Lưu order chi tiết vào cache nếu dùng
            queryClient.setQueryData(['order', newOrder.id], newOrder);
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng';
            toast.error(message);
        },
    });
};
