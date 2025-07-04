import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OrderModule } from "./orders/order.module";
import { DatabaseModule } from "./database/postgres.db";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";
import { RabbitMQModule } from "./base/rabbitmq/rabbitmq.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    // Base
    RabbitMQModule,

    // DB
    DatabaseModule,

    // Module
    OrderModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
