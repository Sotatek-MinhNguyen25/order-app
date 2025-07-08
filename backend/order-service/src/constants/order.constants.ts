// Application constants
export const ORDER_CONSTANTS = {
  // API
  API_PREFIX: "api/v1",

  // Default values
  DEFAULT_PORT: 8005,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,

  // Email
  DEFAULT_EMAIL_RECIPIENT: "nguyenquangminh15092003@gmail.com",

  // Payment
  DEFAULT_PAYMENT_TOKEN: "my_token",

  // Database
  DATABASE_URL: "postgres://root:password@host.docker.internal:5432/orders",

  // Services
  PAYMENT_SERVICE_URL: "http://payment-service:8002",

  // Service names
  RABBITMQ_PAYMENT_SERVICE: "RABBITMQ_PAYMENT_SERVICE",
  RABBITMQ_MAIL_SERVICE: "RABBITMQ_MAIL_SERVICE",

  // Events
  EVENTS: {
    ORDER_CREATED: "order.created",
    ORDER_SEND_MAIL: "order.send.mail",
    ORDER_PAYMENT_RESULT: "order.payment.result"
  },

  // WebSocket Events
  WEBSOCKET_EVENTS: {
    ORDER_CREATED: "orderCreated",
    ORDER_UPDATED: "orderUpdated"
  },

  MICROSERVICE: {
    CONTROLLER: {
      ORDER_CREATE: "order.create",
      ORDER_RETRY_PAYMENT: "order.retry_payment",
      ORDER_UPDATE: "order.update",
      ORDER_GET_ALL: "order.get_all",
      ORDER_GET_BY_ID: "order.get_by_id"
    }
  }
} as const;
