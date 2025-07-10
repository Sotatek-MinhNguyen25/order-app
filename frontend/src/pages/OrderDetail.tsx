import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetail, useRetryPayment, useUpdateOrderStatus } from '../hooks/useOrderDetail';
import { OrderStatus } from '../types/order';
import { formatCurrency, formatDate } from '../libs/utils';
import { Loader2, Package, Calendar, DollarSign, ArrowLeft, Truck, X, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '@/constants';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isPending, refetch } = useOrderDetail(id || '');
  const retryPayment = useRetryPayment();
  const updateOrderStatus = useUpdateOrderStatus();

  const handleRetry = () => {
    if (!id || !order) return;

    const previousStatus = order.status;

    retryPayment.mutate(id, {
      onSuccess: (updatedOrder) => {
        const newStatus = updatedOrder.status;

        if (previousStatus === OrderStatus.CANCELLED) {
          switch (newStatus) {
            case OrderStatus.CONFIRMED:
              toast.success(TOAST_MESSAGES.RETRY_PAYMENT_SUCCESS_CONFIRMED);
              navigate("/orders");
              break;

            case OrderStatus.CANCELLED:
              toast.error(TOAST_MESSAGES.RETRY_PAYMENT_FAILED_CANCELLED);
              break;

            default:
              toast.success(`Thử lại thanh toán hoàn tất. Trạng thái: ${newStatus}`);
              navigate("/orders");
          }
        } else {
          toast.success(`Đã cập nhật trạng thái đơn hàng: ${newStatus}`);
          navigate("/orders");
        }
      },

      onError: () => {
        toast.error("Đã xảy ra lỗi khi thử lại thanh toán.");
      },
    });
  };
  if (!id) return <p className="text-red-500 text-sm">Không tìm thấy mã đơn hàng.</p>;
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-32 text-gray-500 text-sm">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }
  if (!order) return <p className="text-gray-600 text-sm">Không có dữ liệu đơn hàng.</p>;

  // Timeline logic giữ nguyên
  const steps = [
    {
      key: OrderStatus.CREATED,
      status: 'Đã tạo',
      description: 'Đơn hàng được tạo thành công',
      time: formatDate(order.createdAt),
    },
    {
      key: OrderStatus.CONFIRMED,
      status: 'Đã xác nhận',
      description: 'Đơn hàng đang xử lý',
      time: order.status === OrderStatus.CONFIRMED ? formatDate(order.updatedAt) : null,
    },
    {
      key: OrderStatus.DELIVERED,
      status: 'Đã giao',
      description: 'Đơn hàng đã giao',
      time: order.status === OrderStatus.DELIVERED ? formatDate(order.updatedAt) : null,
    },
  ];
  let timeline = steps.map((step, idx) => ({
    ...step,
    completed: idx < steps.findIndex(s => s.key === order.status),
    active: step.key === order.status,
  }));
  if (order.status === OrderStatus.CANCELLED) {
    timeline = [
      { ...steps[0], completed: true, active: false },
      {
        key: OrderStatus.CANCELLED,
        status: 'Đã hủy',
        description: 'Đơn hàng đã bị hủy',
        time: formatDate(order.updatedAt),
        completed: true,
        active: true,
      },
    ];
  }

  // Status badge
  const statusColor = {
    [OrderStatus.CREATED]: 'bg-blue-100 text-blue-700',
    [OrderStatus.CONFIRMED]: 'bg-amber-100 text-amber-700',
    [OrderStatus.DELIVERED]: 'bg-emerald-100 text-emerald-700',
    [OrderStatus.CANCELLED]: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-6 px-2 md:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-blue-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-0.5">Chi tiết đơn hàng</h1>
            <p className="text-sm text-gray-500">Thông tin và tiến trình đơn hàng</p>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow flex items-center justify-center">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <div className="flex items-center gap-1.5 text-base font-semibold text-gray-900">
                {order.productName}
              </div>
              <span className={`ml-0 md:ml-3 px-2 py-1 rounded-full text-xs font-medium border ${statusColor[order.status]} border-current`}>{
                {
                  [OrderStatus.CREATED]: 'Đã tạo',
                  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
                  [OrderStatus.DELIVERED]: 'Đã giao',
                  [OrderStatus.CANCELLED]: 'Đã hủy',
                }[order.status]
              }</span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-6 text-gray-700 text-xs mt-1.5">
              <div className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> {formatCurrency(order.amount)}</div>
              <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(order.createdAt)}</div>
              <div className="flex items-center gap-1.5"><span className="font-semibold">ID:</span> {order.id}</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow border border-blue-100 p-4">
          <h2 className="text-base font-bold text-blue-700 mb-3">Tiến trình đơn hàng</h2>
          <ol className="relative border-l-2 border-blue-200 ml-3 space-y-4">
            {timeline.map((step) => (
              <li key={step.key} className="ml-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${step.completed ? 'bg-emerald-500 border-emerald-500' : step.active ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}>
                    {step.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`font-semibold text-xs ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</span>
                  {step.time && <span className="text-xs text-gray-500 ml-1.5">{step.time}</span>}
                </div>
                <div className={`ml-5 text-xs ${step.completed || step.active ? 'text-gray-700' : 'text-gray-400'}`}>{step.description}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Action buttons */}
        <div className="bg-white rounded-lg shadow border border-blue-100 p-4 flex flex-col gap-3">
          <h2 className="text-base font-bold text-blue-700 mb-1.5">Thao tác</h2>
          <div className="flex flex-col md:flex-row gap-2">
            {(order.status === OrderStatus.CREATED || order.status === OrderStatus.CONFIRMED) && (
              <button
                onClick={() => updateOrderStatus.mutate({ id, status: OrderStatus.CANCELLED }, { onSuccess: () => navigate('/orders') })}
                className="flex-1 bg-rose-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow hover:bg-rose-700 transition-colors"
                disabled={updateOrderStatus.isPending}
              >
                {updateOrderStatus.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin inline mr-1.5" /> : <X className="h-3.5 w-3.5 inline mr-1.5" />}
                Hủy đơn hàng
              </button>
            )}
            {order.status === OrderStatus.CONFIRMED && (
              <button
                onClick={() => updateOrderStatus.mutate({ id, status: OrderStatus.DELIVERED }, { onSuccess: () => navigate('/orders') })}
                className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow hover:bg-emerald-700 transition-colors"
                disabled={updateOrderStatus.isPending}
              >
                {updateOrderStatus.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin inline mr-1.5" /> : <Truck className="h-3.5 w-3.5 inline mr-1.5" />}
                Giao hàng
              </button>
            )}
            {order.status === OrderStatus.CANCELLED && (
              <button
                onClick={handleRetry}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow hover:bg-blue-700 transition-colors"
                disabled={retryPayment.isPending}
              >
                {retryPayment.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin inline mr-1.5" /> : <RotateCcw className="h-3.5 w-3.5 inline mr-1.5" />}
                Thử lại thanh toán
              </button>
            )}
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              ← Về danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;