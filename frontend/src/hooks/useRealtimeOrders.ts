import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../libs/socket';

export const useRealtimeOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    socket.on('order.status.update', handleOrderUpdate);

    return () => {
      socket.off('order.status.update', handleOrderUpdate);
    };
  }, [queryClient]);
};
