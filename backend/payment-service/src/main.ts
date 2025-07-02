import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 8006;

  app.setGlobalPrefix('api/v1');
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
      urls: ['amqp://root:password@localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(PORT);
  console.log('Application is running on port::' + PORT);
}
bootstrap();
