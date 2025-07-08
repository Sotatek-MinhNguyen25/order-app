import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidatorConstraint } from 'class-validator';
import { HttpExceptionInterceptor } from './interceptor/http-exception.interceptor';
import * as morgan from "morgan"
dotenv.config();

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.use(morgan('dev'))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.enableCors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle("Order Service")
    .setDescription("Order Service API description")
    .setVersion("1.0")
    .addTag("orders")
    .build();

  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));
  app.useGlobalInterceptors(new HttpExceptionInterceptor())
  await app.listen(port);
  logger.log(`🚀 App is running on port: ${port}`);
}
bootstrap();
