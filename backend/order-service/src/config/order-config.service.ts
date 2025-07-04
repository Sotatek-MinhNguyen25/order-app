import * as dotenv from "dotenv";
dotenv.config();

export class OrderConfig {
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
}

export const orderConfig = new OrderConfig();
