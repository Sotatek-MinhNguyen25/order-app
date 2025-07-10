import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OrderModule } from "./orders/order.module";
import { DatabaseModule } from "./database/postgres.db";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";
import { RabbitMQModule } from "./base/rabbitmq/rabbitmq.module";
import { CacheApiModule } from "./database/cache/cache.module";
import { RedisModule } from "./database/redis/redis.module";

@Module({
  imports: [
    // Global
    ConfigModule,
    CacheApiModule,

    // Base
    RabbitMQModule,

    // DB
    DatabaseModule,
    RedisModule,

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
