import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { orderConfig } from "src/config";
import { ORDER_CONSTANTS } from "src/constants";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDER_CONSTANTS.RABBITMQ_PAYMENT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [orderConfig.RABBITMQ_URI],
          queue: orderConfig.RABBITMQ_PAYMENT_QUEUE,
          queueOptions: { durable: true }
        }
      },
      {
        name: ORDER_CONSTANTS.RABBITMQ_MAIL_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [orderConfig.RABBITMQ_URI],
          queue: orderConfig.RABBITMQ_MAIL_QUEUE,
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  exports: [ClientsModule]
})
export class RabbitMQModule {}
