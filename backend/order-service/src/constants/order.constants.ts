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
  }
} as const;
