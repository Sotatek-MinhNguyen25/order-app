import * as dotenv from "dotenv";
dotenv.config()

export class NotificationConfig {
  port = Number(process.env.PORT) || 8007;

  rabbitmqUrl =
    process.env.RABBITMQ_URL || 'amqp://root:password@localhost:5672';
  rabbitmqMailQueue = process.env.RABBITMQ_MAIL_QUEUE || 'mail_queue';
  smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  smtpPort = Number(process.env.SMTP_PORT) || 587;
  smtpUser = process.env.SMTP_USER || '';
  smtpPassword = process.env.SMTP_PASSWORD || '';
  smtpFromEmail =
    process.env.SMTP_FROM_EMAIL || 'nguyenquangminhbkimbang@gmail.com';
  smtpFromName = process.env.SMTP_FROM_NAME || 'Order Service';

  corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  };
}
export const notificationConfig = new NotificationConfig();
