import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { paymentConfig } from 'src/config';
import { PAYMENT_CONSTANTS } from 'src/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PAYMENT_CONSTANTS.SERVICES.RABBITMQ_ORDER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [paymentConfig.RABBITMQ_URI],
          queue: paymentConfig.RABBITMQ_ORDER_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
