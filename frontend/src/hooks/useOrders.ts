import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../libs/api';
import { OrderFilters, Order } from '../types/order';
import { QUERY_KEYS, TOAST_MESSAGES } from '../constants';
import toast from 'react-hot-toast';

export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, filters],
    queryFn: () => ordersApi.getOrders(filters),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: (newOrder: Order) => {
      toast.success(TOAST_MESSAGES.ORDER_CREATED_SUCCESS);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(newOrder.id), newOrder);
    },
    onError: () => toast.error(TOAST_MESSAGES.ORDER_CREATED_ERROR),
  });
};
