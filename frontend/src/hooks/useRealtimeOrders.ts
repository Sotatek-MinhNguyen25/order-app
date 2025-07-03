// useRealtimeOrders.ts (custom hook)
import { useEffect } from 'react';
import { socket } from '../libs/socket';
import { useQueryClient } from 'react-query';

export const useRealtimeOrders = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const listener = (updatedOrder: any) => {
            console.log('Order updated:', updatedOrder);
            queryClient.invalidateQueries(['orders']);
        };

        socket.on('order.status.update', listener);

        return () => {
            socket.off('order.status.update', listener);
        };
    }, []);
};
