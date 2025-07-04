// components/OrderActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderStatus } from '../types/order';

interface Props {
    status: OrderStatus;
    isLoading: boolean;
    onConfirm: () => Promise<void>;
    onDeliver: () => void;
    onCancel: () => void;
}

export const OrderActions: React.FC<Props> = ({ status, isLoading, onConfirm, onDeliver, onCancel }) => {
    const navigate = useNavigate();

    const renderButton = (label: string, icon: string, onClick: () => void, color: string) => (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`w-full ${color} text-white px-4 py-2 rounded-lg font-medium hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2`}
        >
            {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
                <span>{icon}</span>
            )}
            {label}
        </button>
    );

    return (
        <div className="space-y-3">
            {status === OrderStatus.CREATED &&
                renderButton('Xác nhận đơn hàng', '✅', onConfirm, 'bg-blue-600')}

            {status === OrderStatus.CONFIRMED &&
                renderButton('Giao hàng', '🚚', onDeliver, 'bg-green-600')}

            {(status === OrderStatus.CREATED || status === OrderStatus.CONFIRMED) &&
                renderButton('Hủy đơn hàng', '❌', onCancel, 'bg-red-600')}

            {(status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED) && (
                <div className="w-full text-center px-4 py-2 rounded-lg font-medium border text-sm bg-gray-100 text-gray-800">
                    {status === OrderStatus.DELIVERED ? '🎉 Đã giao thành công' : '🚫 Đã bị hủy'}
                </div>
            )}

            <button
                onClick={() => navigate('/orders')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
            >
                ← Về danh sách
            </button>
        </div>
    );
};
