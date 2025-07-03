import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../libs/api';
import toast from 'react-hot-toast';
import { Order } from '../types/order';

export const useOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: Boolean(id),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: (updatedOrder: Order) => {
      toast.success('Hủy đơn hàng thành công');
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => toast.error('Có lỗi khi hủy đơn hàng'),
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
