import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from 'react-query';
import { ordersApi } from '../libs/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Order, ApiErrorResponse } from '../types/order';

// Reusable error handler
const handleError = (error: AxiosError<ApiErrorResponse>, fallbackMessage: string) => {
    const msg = error?.response?.data?.message || fallbackMessage;
    toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
};

// Hook: Lấy chi tiết đơn hàng
export const useOrderDetail = (id: string): UseQueryResult<Order, AxiosError<ApiErrorResponse>> => {
    return useQuery<Order, AxiosError<ApiErrorResponse>>(
        ['order', id],
        () => ordersApi.getOrderById(id),
        {
            enabled: Boolean(id),
            staleTime: 30000,
            onError: (err) => handleError(err, 'Lỗi khi tải chi tiết đơn hàng'),
        }
    );
};

// Tạo reusable mutation hook
const useOrderMutation = (
    mutationFn: (id: string) => Promise<Order>,
    successMsg: string,
    fallbackErrorMsg: string
): UseMutationResult<Order, AxiosError<ApiErrorResponse>, string> => {
    const queryClient = useQueryClient();

    return useMutation<Order, AxiosError<ApiErrorResponse>, string>(mutationFn, {
        onSuccess: (updatedOrder) => {
            // Cập nhật cache đơn chi tiết
            queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
            // Invalidate danh sách đơn hàng
            queryClient.invalidateQueries('orders');
            toast.success(successMsg);
        },
        onError: (err) => handleError(err, fallbackErrorMsg),
    });
};

// Hook: Hủy đơn hàng
export const useCancelOrder = () =>
    useOrderMutation(
        ordersApi.cancelOrder,
        'Đơn hàng đã được hủy thành công',
        'Có lỗi xảy ra khi hủy đơn hàng'
    );

// Hook: Thử lại thanh toán
export const useRetryPayment = () =>
    useOrderMutation(
        ordersApi.retryPayment,
        'Thử lại thanh toán thành công',
        'Có lỗi xảy ra khi thử lại thanh toán'
    );
