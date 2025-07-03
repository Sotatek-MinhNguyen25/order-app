import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrdersMessageController } from "./order-message.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ClientsModule.register([
      {
        name: "RABBITMQ_ORDER_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://root:password@localhost:5672"],
          queue: "payment_queue",
          queueOptions: { durable: true },
        },
      },
      {
        name: "RABBITMQ_MAIL_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://root:password@localhost:5672'],
          queue: "mail_queue",
          queueOptions: { durable: true },
        },
      },
    ]),

  ],
  controllers: [OrderController, OrdersMessageController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }
