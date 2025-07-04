import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../libs/api';
import toast from 'react-hot-toast';
import { Order, OrderStatus } from '../types/order';

export const useOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: Boolean(id),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (updatedOrder: Order) => {
      const statusMessages = {
        [OrderStatus.CANCELLED]: 'Hủy đơn hàng thành công',
        [OrderStatus.DELIVERED]: 'Giao hàng thành công',
        [OrderStatus.CONFIRMED]: 'Xác nhận đơn hàng thành công',
        [OrderStatus.CREATED]: 'Tạo đơn hàng thành công',
      };
      toast.success(statusMessages[updatedOrder.status] || 'Cập nhật trạng thái thành công');
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => toast.error('Có lỗi khi cập nhật trạng thái đơn hàng'),
  });
};

export const useRetryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.retryPayment,
    onSuccess: (updatedOrder: Order) => {
      toast.success('Thử lại thanh toán thành công');
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => toast.error('Có lỗi khi thử lại thanh toán'),
  });
};
