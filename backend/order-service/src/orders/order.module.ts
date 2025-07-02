import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrdersMessageController } from "./order-message.controller";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    MailModule,
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://root:password@localhost:5672"],
          queue: "main_queue",
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  controllers: [OrderController, OrdersMessageController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
