import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrdersMessageController } from "./order-message.controller";
import { RabbitMQModule } from "src/base/rabbitmq/rabbitmq.module";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), RabbitMQModule],
  controllers: [OrderController, OrdersMessageController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
