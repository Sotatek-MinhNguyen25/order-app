import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../libs/socket';
import { Order } from '../types/order';
import { WEBSOCKET_EVENTS, QUERY_KEYS } from '../constants';
import { useConnection } from './useConnection';
import toast from 'react-hot-toast';

export const useRealtimeOrders = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useConnection();

  useEffect(() => {
    if (!isOnline) return;

    const updateOrderList = (order: Order) => {
      queryClient.setQueryData(QUERY_KEYS.ORDERS, (oldData: any) => {
        if (!oldData) return oldData;

        const updateItem = (item: Order) => (item.id === order.id ? order : item);

        if (Array.isArray(oldData?.data)) {
          return { ...oldData, data: oldData.data.map(updateItem) };
        }

        if (Array.isArray(oldData)) {
          return oldData.map(updateItem);
        }

        return oldData;
      });
    };

    const handleOrderCreated = (order: Order) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(order.id), order);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    };

    const handleOrderUpdated = (order: Order) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(order.id), order);
      updateOrderList(order);
      toast(`Đơn hàng #${order.productName} đã cập nhật trạng thái`, {
        icon: '🔄',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    };

    socket.on(WEBSOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
    socket.on(WEBSOCKET_EVENTS.ORDER_UPDATED, handleOrderUpdated);

    return () => {
      socket.off(WEBSOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
      socket.off(WEBSOCKET_EVENTS.ORDER_UPDATED, handleOrderUpdated);
    };
  }, [queryClient, isOnline]);
};
