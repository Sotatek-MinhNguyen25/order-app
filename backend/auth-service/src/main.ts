import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { authConfig } from './configs/config.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: authConfig.HOST,
      port: authConfig.PORT,
    },
  });

  await app.listen();
  logger.log(`✅ Auth Microservice is running on TCP ${authConfig.HOST}:${authConfig.PORT}`);
}
bootstrap();
