import React from 'react';
import { OrderStatus } from '../types/order';

interface Props {
  status: OrderStatus;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onDeliver: () => void;
  onCancel: () => void;
}

export const OrderActions: React.FC<Props> = ({
  status,
  isLoading,
  onConfirm,
  onDeliver,
  onCancel,
}) => {
  return (
    <div className="space-y-3">
      {status === OrderStatus.CREATED && (
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          {isLoading ? 'Đang xác nhận...' : 'Xác nhận đơn hàng'}
        </button>
      )}
      {status === OrderStatus.CONFIRMED && (
        <button
          onClick={onDeliver}
          disabled={isLoading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-700 transition-colors"
        >
          {isLoading ? 'Đang giao...' : 'Giao hàng'}
        </button>
      )}
      {(status === OrderStatus.CREATED || status === OrderStatus.CONFIRMED) && (
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-red-700 transition-colors"
        >
          {isLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
        </button>
      )}
      {(status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED) && (
        <div className="w-full text-center px-4 py-2 rounded-xl font-medium border text-sm bg-gray-100 text-gray-800">
          {status === OrderStatus.DELIVERED ? '🎉 Đã giao thành công' : '🚫 Đã bị hủy'}
        </div>
      )}
      <button
        onClick={() => window.history.back()}
        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
      >
        ← Về danh sách
      </button>
    </div>
  );
};
