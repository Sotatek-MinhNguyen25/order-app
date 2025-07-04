import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { PAYMENT_CONSTANTS } from './constants';
import { paymentConfig } from './config';

async function bootstrap() {
  const logger = new Logger('PaymentService');
  const app = await NestFactory.create(AppModule);
  const PORT = paymentConfig.PORT;

  app.setGlobalPrefix(PAYMENT_CONSTANTS.API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [paymentConfig.RABBITMQ_URI],
      queue: paymentConfig.RABBITMQ_PAYMENT_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
  logger.log(`🚀 Payment service is running on port ${PORT}`);
  logger.log(`📬 Connected to RabbitMQ queue: ${paymentConfig.RABBITMQ_PAYMENT_QUEUE}`);
}
bootstrap();
