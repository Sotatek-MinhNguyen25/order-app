// Payment Service constants
export const PAYMENT_CONSTANTS = {
  // API
  API_PREFIX: 'api/v1',

  // Events
  EVENTS: {
    ORDER_CREATED: 'order.created',
    ORDER_PAYMENT_RESULT: 'order.payment.result',
  },

  SERVICES: {
    RABBITMQ_ORDER_SERVICE: 'RABBITMQ_ORDER_SERVICE',
  },
} as const;
