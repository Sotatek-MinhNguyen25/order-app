import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../libs/api';
import { QUERY_KEYS, TOAST_MESSAGES } from '../constants';
import toast from 'react-hot-toast';
import { Order, OrderStatus } from '../types/order';

export const useOrderDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: Boolean(id),
    staleTime: 5 * 1000
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (updatedOrder: Order) => {
      const statusMessages = {
        [OrderStatus.CANCELLED]: TOAST_MESSAGES.ORDER_STATUS.CANCELLED,
        [OrderStatus.DELIVERED]: TOAST_MESSAGES.ORDER_STATUS.DELIVERED,
        [OrderStatus.CONFIRMED]: TOAST_MESSAGES.ORDER_STATUS.CONFIRMED,
        [OrderStatus.CREATED]: TOAST_MESSAGES.ORDER_STATUS.CREATED,
      };
      toast.success(statusMessages[updatedOrder.status] || TOAST_MESSAGES.STATUS_UPDATE_SUCCESS);
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(updatedOrder.id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: () => toast.error(TOAST_MESSAGES.ORDER_UPDATE_ERROR),
  });
};

export const useRetryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.retryPayment,
    onSuccess: (updatedOrder: Order) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(updatedOrder.id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: () => toast.error(TOAST_MESSAGES.RETRY_PAYMENT_ERROR),
  });
};
