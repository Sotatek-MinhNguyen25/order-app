import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../libs/api';
import { OrderFilters, Order } from '../types/order';
import toast from 'react-hot-toast';

export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getOrders(filters),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: (newOrder: Order) => {
      toast.success('Tạo đơn hàng thành công!');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.setQueryData(['order', newOrder.id], newOrder);
    },
    onError: () => toast.error('Có lỗi khi tạo đơn hàng'),
  });
};
