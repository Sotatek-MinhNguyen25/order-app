import * as dotenv from "dotenv";
dotenv.config();

export class OrderConfig {
  HOST = process.env.HOST || "127.0.0.1";
  PORT: number = Number(process.env.PORT) || 8005;

  DB_HOST: string = process.env.DB_HOST || "localhost";
  DB_PORT: number = Number(process.env.DB_PORT) || 5432;
  DB_USER = process.env.DB_USER || "postgres";

  DB_PASSWORD: string = process.env.DB_PASSWORD || "password";
  DB_NAME: string = process.env.DB_NAME || "order_service";

  RABBITMQ_URI: string = process.env.RABBITMQ_URI || "";
  RABBITMQ_ORDER_QUEUE: string =
    process.env.RABBITMQ_ORDER_QUEUE || "order_queue";
  RABBITMQ_PAYMENT_QUEUE: string =
    process.env.RABBIT_PAYMENT_QUEUE || "payment_queue";
  RABBITMQ_MAIL_QUEUE: string = process.env.RABBIT_MAIL_QUEUE || "mail_queue";

  REDIS_HOST: string = process.env.REDIS_HOST || "localhost";
  REDIS_PORT: number = parseInt(process.env.REDIS_PORT || "6379");

  THROTTLER_LIMIT: number = parseInt(process.env.THROTTLER_LIMIT || "5");
  THROTTLER_TTL: number = parseInt(process.env.THROTTLER_TTL || "60");
}

export const orderConfig = new OrderConfig();
