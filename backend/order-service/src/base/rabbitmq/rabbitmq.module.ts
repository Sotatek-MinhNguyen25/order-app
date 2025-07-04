import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_PAYMENT_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://root:password@localhost:5672"],
          queue: "payment_queue",
          queueOptions: { durable: true }
        }
      },
      {
        name: "RABBITMQ_MAIL_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || "amqp://root:password@localhost:5672"
          ],
          queue: "mail_queue",
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  providers: [],
  exports: [ClientsModule]
})
export class RabbitMQModule {}
