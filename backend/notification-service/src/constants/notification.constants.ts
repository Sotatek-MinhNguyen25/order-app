// Notification Service constants
export const NOTIFICATION_CONSTANTS = {
  // API
  API_PREFIX: 'api/v1',

  // Events
  EVENTS: {
    ORDER_SEND_MAIL: 'order.send.mail',
  },

  EMAIL_TEMPLATES: {
    ORDER_STATUS: 'notification.hbs',
  },
  EMAIL_SUBJECTS: {
    ORDER_STATUS: 'Cập nhật trạng thái đơn hàng',
  },
} as const;
