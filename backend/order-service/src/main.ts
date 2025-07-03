import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AllExceptionsFilter } from "./common/exception/all-exceptions.filter";
import { ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";
import * as dotenv from "dotenv";
import { ResponseMessageInterceptor } from "./common/interceptor/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 8005;
  const reflect = app.get(Reflector);

  dotenv.config();

  app.use(morgan("dev"));
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  const rabbitMqUri =
    process.env.RABBITMQ_URI || "amqp://root:password@localhost:5672";
  const rabbitMqQueue = process.env.RABBITMQ_QUEUE || "order_queue";

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

  const config = new DocumentBuilder()
    .setTitle("Order Service")
    .setDescription("Order Service API description")
    .setVersion("1.0")
    .addTag("orders")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  // Interceptor
  app.useGlobalInterceptors(new ResponseMessageInterceptor(reflect));

  // Exception
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.startAllMicroservices();
  await app.listen(PORT);
  console.log("Application is running on port::" + PORT);
}
bootstrap();
