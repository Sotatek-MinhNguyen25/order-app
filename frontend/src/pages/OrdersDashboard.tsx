import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Search, RefreshCw } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { OrderFilters, OrderStatus, SortOrder } from '../types/order';
import { formatCurrency, formatDate } from '../libs/utils';

const OrdersDashboard: React.FC = () => {
  const [filters, setFilters] = React.useState<OrderFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
  });

  const { data: ordersResponse, isPending, error, refetch } = useOrders(filters);

  // Enable real-time updates
  useRealtimeOrders();

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleStatusFilter = (status: OrderStatus | undefined) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.CREATED]: 'bg-blue-50 text-blue-700 border-blue-200',
      [OrderStatus.CONFIRMED]: 'bg-amber-50 text-amber-700 border-amber-200',
      [OrderStatus.DELIVERED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      [OrderStatus.CANCELLED]: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    const statusLabels = {
      [OrderStatus.CREATED]: 'Đã tạo',
      [OrderStatus.CONFIRMED]: 'Đã xác nhận',
      [OrderStatus.DELIVERED]: 'Đã giao',
      [OrderStatus.CANCELLED]: 'Đã hủy',
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const getStats = () => {
    if (!ordersResponse?.data) return { total: 0, confirmed: 0, delivered: 0, cancelled: 0 };

    const data = ordersResponse.data;
    return {
      total: data.length,
      confirmed: data.filter(o => o.status === OrderStatus.CONFIRMED).length,
      delivered: data.filter(o => o.status === OrderStatus.DELIVERED).length,
      cancelled: data.filter(o => o.status === OrderStatus.CANCELLED).length,
    };
  };

  const stats = getStats();

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">Không thể tải dữ liệu đơn hàng</p>
          <button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-5 px-2 md:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Quản lý đơn hàng</h1>
            <p className="text-gray-500 text-sm md:text-base">Theo dõi, tìm kiếm và thao tác với đơn hàng của bạn một cách dễ dàng.</p>
          </div>
          <Link to="/orders/create" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform font-semibold text-sm md:text-base">
            <Plus className="h-4 w-4" />
            Tạo đơn hàng
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-col items-center">
            <div className="p-2 bg-blue-50 rounded-full mb-1.5"><Package className="h-5 w-5 text-blue-600" /></div>
            <p className="text-xs text-gray-500">Tổng đơn hàng</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-col items-center">
            <div className="p-2 bg-amber-50 rounded-full mb-1.5"><Package className="h-5 w-5 text-amber-600" /></div>
            <p className="text-xs text-gray-500">Đã xác nhận</p>
            <p className="text-xl font-bold text-amber-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-col items-center">
            <div className="p-2 bg-emerald-50 rounded-full mb-1.5"><Package className="h-5 w-5 text-emerald-600" /></div>
            <p className="text-xs text-gray-500">Đã giao</p>
            <p className="text-xl font-bold text-emerald-600">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-col items-center">
            <div className="p-2 bg-rose-50 rounded-full mb-1.5"><Package className="h-5 w-5 text-rose-600" /></div>
            <p className="text-xs text-gray-500">Đã hủy</p>
            <p className="text-xl font-bold text-rose-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full relative">
            <Search className="h-4 w-4 absolute left-3 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm hoặc mã đơn hàng..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={filters.search || ''}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={filters.status || ''}
            onChange={e => handleStatusFilter((e.target.value as OrderStatus) || undefined)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value={OrderStatus.CREATED}>Đã tạo</option>
            <option value={OrderStatus.CONFIRMED}>Đã xác nhận</option>
            <option value={OrderStatus.DELIVERED}>Đã giao</option>
            <option value={OrderStatus.CANCELLED}>Đã hủy</option>
          </select>
          <select
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={e => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as SortOrder }));
            }}
          >
            <option value="createdAt-DESC">Mới nhất</option>
            <option value="createdAt-ASC">Cũ nhất</option>
            <option value="amount-DESC">Giá cao nhất</option>
            <option value="amount-ASC">Giá thấp nhất</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow border border-gray-100">
          {isPending ? (
            <div className="p-4 flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-28 mb-1.5"></div>
                      <div className="h-2.5 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-7 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !ordersResponse?.data?.length ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">Chưa có đơn hàng nào</h3>
              <p className="text-sm text-gray-600 mb-4">Bắt đầu bằng cách tạo đơn hàng đầu tiên của bạn</p>
              <Link to="/orders/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Tạo đơn hàng
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {ordersResponse.data.map(order => (
                <div key={order.id} className="p-4 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{order.productName}</h3>
                      {/* <p className="text-xs text-gray-500">{order.id}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-base">{formatCurrency(order.amount)}</p>
                      <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                    <Link
                      to={`/orders/${order.id}`}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {ordersResponse && ordersResponse.meta.totalPages > 1 && (
          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs text-gray-600">
              Hiển thị {(ordersResponse.meta.currentPage - 1) * ordersResponse.meta.pageSize + 1} -{' '}
              {Math.min(
                ordersResponse.meta.currentPage * ordersResponse.meta.pageSize,
                ordersResponse.meta.totalItems
              )}{' '}
              của {ordersResponse.meta.totalItems} đơn hàng
            </p>
            <div className="flex items-center space-x-1.5">
              <button
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={ordersResponse.meta.currentPage <= 1}
                onClick={() => handlePageChange(ordersResponse.meta.currentPage - 1)}
              >
                Trước
              </button>
              {Array.from({ length: Math.min(5, ordersResponse.meta.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${page === ordersResponse.meta.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={ordersResponse.meta.currentPage >= ordersResponse.meta.totalPages}
                onClick={() => handlePageChange(ordersResponse.meta.currentPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersDashboard;
