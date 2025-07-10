import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AllExceptionsFilter } from "./common/exception/all-exceptions.filter";
import { ValidationPipe, Logger } from "@nestjs/common";
import * as morgan from "morgan";
import * as dotenv from "dotenv";
import { ResponseMessageInterceptor } from "./common/interceptor/response.interceptor";
import { orderConfig } from "./config";
import { ORDER_CONSTANTS } from "./constants";

async function bootstrap() {
  const logger = new Logger("OrderServiceBootstrap");

  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const PORT = orderConfig.PORT;
  const reflect = app.get(Reflector);

  app.use(morgan("dev"));
  app.setGlobalPrefix(ORDER_CONSTANTS.API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  const rabbitMqUri = orderConfig.RABBITMQ_URI;
  const rabbitMqQueue = orderConfig.RABBITMQ_ORDER_QUEUE;

  app.enableCors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUri],
      queue: rabbitMqQueue,
      queueOptions: {
        durable: true
      }
    }
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: orderConfig.HOST,
      port: orderConfig.PORT
    }
  });

  const config = new DocumentBuilder()
    .setTitle("Order Service")
    .setDescription("Order Service API description")
    .setVersion("1.0")
    .addTag("orders")
    .build();

  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));

  app.useGlobalInterceptors(new ResponseMessageInterceptor(reflect));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.startAllMicroservices();
  await app.listen(PORT);

  logger.log(`🚀 Order Service is running on port :: ${PORT}`);
  logger.log(`📚 Swagger available at http://localhost:${PORT}/api`);
  logger.log(`📬 Connected to RabbitMQ queue: ${rabbitMqQueue}`);
}
bootstrap();
