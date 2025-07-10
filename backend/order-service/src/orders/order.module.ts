import { Module } from "@nestjs/common";
import { OrderService } from "./services/order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQModule } from "src/base/rabbitmq/rabbitmq.module";
import { OrdersGateway } from "./services/orders.gateway";
import { CacheApiModule } from "src/database/cache/cache.module";
import { OrderController } from "./controllers/order.controller";
import { OrdersMessageController } from "./controllers/order-message.controller";
import { OrderCacheService } from "./services/order-cache.service";
import { RedisModule } from "src/database/redis/redis.module";
import { OrderEventController } from "./controllers/order-event.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    RabbitMQModule,
    CacheApiModule,
    RedisModule
  ],
  controllers: [OrderController, OrdersMessageController, OrderEventController],
  providers: [OrderService, OrdersGateway, OrderCacheService],
  exports: [OrderService, OrdersGateway, OrderCacheService]
})
export class OrderModule {}
