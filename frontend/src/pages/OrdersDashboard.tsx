import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Package, RefreshCw } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderFilters, OrderStatus, SortOrder } from '../types/order';
import { formatCurrency, formatDate } from '../libs/utils';

const OrdersDashboard: React.FC = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
  });

  const { data: ordersResponse, isPending, error, refetch } = useOrders(filters);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý đơn hàng</h1>
            <p className="text-blue-100">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
          </div>
          <Link to="/orders/create" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn hàng
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-amber-600">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã giao</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.delivered}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-rose-600">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg">
              <Package className="h-6 w-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm hoặc mã đơn hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search || ''}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {isPending ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !ordersResponse?.data?.length ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-6">Bắt đầu bằng cách tạo đơn hàng đầu tiên của bạn</p>
            <Link to="/orders/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Tạo đơn hàng
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {ordersResponse.data.map(order => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-600">ID: #{order.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                    <Link
                      to={`/orders/${order.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {ordersResponse && ordersResponse.meta.totalPages > 1 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {(ordersResponse.meta.currentPage - 1) * ordersResponse.meta.pageSize + 1} -{' '}
              {Math.min(
                ordersResponse.meta.currentPage * ordersResponse.meta.pageSize,
                ordersResponse.meta.totalItems
              )}{' '}
              của {ordersResponse.meta.totalItems} đơn hàng
            </p>
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${page === ordersResponse.meta.currentPage
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={ordersResponse.meta.currentPage >= ordersResponse.meta.totalPages}
                onClick={() => handlePageChange(ordersResponse.meta.currentPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
