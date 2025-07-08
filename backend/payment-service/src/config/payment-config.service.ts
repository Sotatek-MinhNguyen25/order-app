import * as dotenv from "dotenv";
dotenv.config()
export class PaymentConfig {
    HOST = process.env.HOST || '127.0.0.1';
    PORT = +(process.env.PORT || 8006);

    RABBITMQ_URI =
        process.env.RABBITMQ_URI || 'amqp://root:password@localhost:5672';
    RABBITMQ_PAYMENT_QUEUE =
        process.env.RABBITMQ_PAYMENT_QUEUE || 'payment_queue';
    RABBITMQ_ORDER_QUEUE = process.env.RABBITMQ_ORDER_QUEUE || 'order_queue';
}

export const paymentConfig = new PaymentConfig();
