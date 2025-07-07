import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  RotateCcw,
  X,
  Loader2,
  Truck,
} from 'lucide-react';
import { useOrderDetail, useRetryPayment, useUpdateOrderStatus } from '../hooks/useOrderDetail';
import { OrderStatus } from '../types/order';
import { formatCurrency, formatDate } from '../libs/utils';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isPending, refetch } = useOrderDetail(id || '');
  const retryPayment = useRetryPayment();
  const updateOrderStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleCancel = () => {
    if (id) updateOrderStatus.mutate({ id, status: OrderStatus.CANCELLED }, {
      onSuccess: () => navigate('/orders'),
    });
  };

  const handleDeliver = () => {
    if (id) updateOrderStatus.mutate({ id, status: OrderStatus.DELIVERED }, {
      onSuccess: () => navigate('/orders'),
    });
  };

  const handleRetry = () => id && retryPayment.mutate(id);

  if (!id) return <p className="text-red-500">Không tìm thấy mã đơn hàng.</p>;
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }
  if (!order) return <p className="text-gray-600">Không có dữ liệu đơn hàng.</p>;

  const renderInfoItem = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  const renderTimelineItem = (step: any, index: number, totalSteps: number) => (
    <div key={step.key} className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
          ${step.completed
              ? 'bg-green-500 border-green-500'
              : step.active
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
        >
          {step.completed && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        {index < totalSteps - 1 && (
          <div
            className={`w-0.5 h-12 ml-1.5 mt-2 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-8">
        <p
          className={`font-medium ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}
        >
          {step.status}
        </p>
        <p
          className={`text-sm mt-1 ${step.completed || step.active ? 'text-gray-600' : 'text-gray-400'}`}
        >
          {step.description}
        </p>
        {step.time && (
          <p
            className={`text-xs mt-2 ${step.active ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
          >
            {step.time}
          </p>
        )}
      </div>
    </div>
  );

  const generateTimeline = (status: OrderStatus, createdAt: string, updatedAt: string) => {
    const steps = [
      {
        key: OrderStatus.CREATED,
        status: 'Đã tạo',
        description: 'Đơn hàng được tạo thành công',
        time: formatDate(createdAt),
      },
      {
        key: OrderStatus.CONFIRMED,
        status: 'Đã xác nhận',
        description: 'Đơn hàng đang xử lý',
        time: status === OrderStatus.CONFIRMED ? formatDate(updatedAt) : null,
      },
      {
        key: OrderStatus.DELIVERED,
        status: 'Đã giao',
        description: 'Đơn hàng đã giao',
        time: status === OrderStatus.DELIVERED ? formatDate(updatedAt) : null,
      },
    ];

    if (status === OrderStatus.CANCELLED) {
      return [
        { ...steps[0], completed: true },
        {
          key: OrderStatus.CANCELLED,
          status: 'Đã hủy',
          description: 'Đơn hàng đã bị hủy',
          time: formatDate(updatedAt),
          completed: true,
          active: true,
        },
      ];
    }

    const orderLevel =
      {
        [OrderStatus.CREATED]: 1,
        [OrderStatus.CONFIRMED]: 2,
        [OrderStatus.DELIVERED]: 3,
      }[status] || 1;

    return steps.map((step, index) => ({
      ...step,
      completed: index + 1 < orderLevel,
      active: index + 1 === orderLevel,
    }));
  };

  const getStatusConfig = (status: OrderStatus) => {
    const colors =
      {
        [OrderStatus.CREATED]: 'blue',
        [OrderStatus.CONFIRMED]: 'orange',
        [OrderStatus.DELIVERED]: 'green',
        [OrderStatus.CANCELLED]: 'red',
      }[status] || 'blue';

    return {
      bgColor: `bg-${colors}-50`,
      textColor: `text-${colors}-800`,
      badgeColor: `bg-${colors}-100`,
    };
  };

  const timeline = generateTimeline(order.status, order.createdAt, order.updatedAt);
  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết đơn hàng
          </h1>
          <p className="text-gray-600">Thông tin chi tiết và tiến trình đơn hàng</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInfoItem(
                <Package className="h-5 w-5 text-gray-400" />,
                'Sản phẩm',
                order.productName
              )}
              {renderInfoItem(
                <DollarSign className="h-5 w-5 text-gray-400" />,
                'Số tiền',
                formatCurrency(order.amount)
              )}
              {renderInfoItem(
                <Calendar className="h-5 w-5 text-gray-400" />,
                'Ngày tạo',
                formatDate(order.createdAt)
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-6">Tiến trình đơn hàng</h2>
            <div className="space-y-0">
              {timeline.map((step, index) => renderTimelineItem(step, index, timeline.length))}
            </div>
          </div>
        </div>

        {/* Right: Status + Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Trạng thái hiện tại</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${statusConfig.bgColor}`}>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.badgeColor} ${statusConfig.textColor}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Ngày tạo:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cập nhật lần cuối:</span>
                  <span className="font-medium">{formatDate(order.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-medium text-gray-900 mb-3">Thao tác</h3>
            <div className="space-y-2">
              {order.status === OrderStatus.CANCELLED && (
                <button
                  onClick={handleRetry}
                  className="btn-success w-full"
                  disabled={retryPayment.isPending}
                >
                  {retryPayment.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-2" />
                  )}
                  Thử lại thanh toán
                </button>
              )}

              {order.status === OrderStatus.CONFIRMED && (
                <button
                  onClick={handleDeliver}
                  className="btn-success w-full"
                  disabled={updateOrderStatus.isPending}
                >
                  {updateOrderStatus.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Truck className="h-4 w-4 mr-2" />
                  )}
                  Giao hàng
                </button>
              )}

              {(order.status === OrderStatus.CREATED || order.status === OrderStatus.CONFIRMED) && (
                <button
                  onClick={handleCancel}
                  className="btn-danger w-full"
                  disabled={updateOrderStatus.isPending}
                >
                  {updateOrderStatus.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Hủy đơn hàng
                </button>
              )}
              <button onClick={() => navigate('/orders')} className="btn-secondary w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về danh sách đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;