export const WEBSOCKET_EVENTS = {
    ORDER_CREATED: 'orderCreated',
    ORDER_UPDATED: 'orderUpdated'
} as const;

export const QUERY_KEYS = {
    ORDERS: ['orders'],
    ORDER_DETAIL: (id: string) => ['orders', id]
} as const;

export const TOAST_MESSAGES = {
    ORDER_CREATED_SUCCESS: 'Tạo đơn hàng thành công!',
    ORDER_CREATED_ERROR: 'Có lỗi khi tạo đơn hàng',
    ORDER_UPDATE_ERROR: 'Có lỗi khi cập nhật trạng thái đơn hàng',
    RETRY_PAYMENT_SUCCESS: 'Thử lại thanh toán thành công',
    RETRY_PAYMENT_ERROR: 'Có lỗi khi thử lại thanh toán',
    RETRY_PAYMENT_SUCCESS_CONFIRMED: 'Thử lại thanh toán thành công! Đơn hàng đã được xác nhận.',
    RETRY_PAYMENT_FAILED_CANCELLED: 'Thử lại thanh toán thất bại. Đơn hàng vẫn ở trạng thái đã hủy.',
    STATUS_UPDATE_SUCCESS: 'Cập nhật trạng thái thành công',
    ORDER_STATUS: {
        CANCELLED: 'Hủy đơn hàng thành công',
        DELIVERED: 'Giao hàng thành công',
        CONFIRMED: 'Xác nhận đơn hàng thành công',
        CREATED: 'Tạo đơn hàng thành công'
    },
    CONNECTION: {
        NETWORK_RESTORED: 'Kết nối mạng đã được khôi phục',
        NETWORK_LOST: 'Mất kết nối mạng. Ứng dụng sẽ hoạt động offline',
        OFFLINE_MODE_ON: 'Chuyển sang chế độ Offline',
        OFFLINE_MODE_OFF: 'Chuyển sang chế độ Online'
    }
} as const;