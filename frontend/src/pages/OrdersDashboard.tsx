import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, Filter, Search, Package, Loader2, RefreshCw
} from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderFilters, OrderStatus, SortOrder } from '../types/order';
import { formatCurrency, formatDate, cn } from '../libs/utils';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const OrdersDashboard: React.FC = () => {
    useRealtimeOrders();
    const [filters, setFilters] = useState<OrderFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
    });

    const { data: ordersResponse, isLoading, error, refetch } = useOrders(filters);

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
            [OrderStatus.CREATED]: 'bg-blue-100 text-blue-800 border-blue-200',
            [OrderStatus.CONFIRMED]: 'bg-orange-100 text-orange-800 border-orange-200',
            [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 border-green-200',
            [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
        };

        const statusLabels = {
            [OrderStatus.CREATED]: 'Đã tạo',
            [OrderStatus.CONFIRMED]: 'Đã xác nhận',
            [OrderStatus.DELIVERED]: 'Đã giao',
            [OrderStatus.CANCELLED]: 'Đã hủy',
        };

        return (
            <span className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                statusConfig[status]
            )}>
                {statusLabels[status]}
            </span>
        );
    };

    const renderLoadingSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-4">Bắt đầu bằng cách tạo đơn hàng đầu tiên</p>
            <Link to="/orders/create" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Tạo đơn hàng
            </Link>
        </div>
    );

    const renderOrdersList = () => (
        ordersResponse!.data.map((order) => (
            <div key={order.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary-600" />
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
                        <Link to={`/orders/${order.id}`} className="btn-secondary">
                            Xem chi tiết
                        </Link>
                    </div>
                </div>
            </div>
        ))
    );

    const renderPagination = () => {
        const meta = ordersResponse!.meta;
        if (meta.totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Hiển thị{' '}
                    <span className="font-medium">{(meta.currentPage - 1) * meta.pageSize + 1}</span>{' '}
                    đến{' '}
                    <span className="font-medium">
                        {Math.min(meta.currentPage * meta.pageSize, meta.totalItems)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{meta.totalItems}</span> đơn hàng
                </p>

                <div className="flex items-center space-x-2">
                    <button
                        className="btn-secondary"
                        disabled={meta.currentPage <= 1}
                        onClick={() => handlePageChange(meta.currentPage - 1)}
                    >
                        Trước
                    </button>
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={cn(page === meta.currentPage ? 'btn-primary' : 'btn-secondary')}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="btn-secondary"
                        disabled={meta.currentPage >= meta.totalPages}
                        onClick={() => handlePageChange(meta.currentPage + 1)}
                    >
                        Sau
                    </button>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
                    <button onClick={() => refetch()} className="btn-primary">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Quản lý tất cả đơn hàng của bạn</p>
                </div>
                <Link to="/orders/create" className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo đơn hàng
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            className="input pl-10"
                            value={filters.search || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    <select
                        className="input w-full sm:w-48"
                        value={filters.status || ''}
                        onChange={(e) =>
                            handleStatusFilter(e.target.value as OrderStatus || undefined)
                        }
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value={OrderStatus.CREATED}>Đã tạo</option>
                        <option value={OrderStatus.CONFIRMED}>Đã xác nhận</option>
                        <option value={OrderStatus.DELIVERED}>Đã giao</option>
                        <option value={OrderStatus.CANCELLED}>Đã hủy</option>
                    </select>

                    <select
                        className="input w-full sm:w-48"
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(e) => {
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

            {/* Content */}
            <div className="space-y-4">
                {isLoading
                    ? renderLoadingSkeleton()
                    : !ordersResponse?.data?.length
                        ? renderEmptyState()
                        : renderOrdersList()}
            </div>

            {/* Pagination */}
            {ordersResponse && renderPagination()}
        </div>
    );
};

export default OrdersDashboard;
