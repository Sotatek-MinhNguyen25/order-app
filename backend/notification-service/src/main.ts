import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import { NOTIFICATION_CONSTANTS } from './constants';
import { notificationConfig } from './config';

async function bootstrap() {
  dotenv.config();
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ?? 8003;

  app.use(morgan('dev'));
  app.setGlobalPrefix(NOTIFICATION_CONSTANTS.API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const rabbitMqUri = notificationConfig.rabbitmqUrl;
  const rabbitMqQueue = notificationConfig.rabbitmqMailQueue;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUri],
      queue: rabbitMqQueue,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.enableCors(notificationConfig.corsOptions);

  await app.startAllMicroservices();
  await app.listen(PORT);

  logger.log(`🚀 Application is running on http://localhost:${PORT}`);
  logger.log(`📬 Connected to RabbitMQ queue: ${rabbitMqQueue}`);
}
bootstrap();
