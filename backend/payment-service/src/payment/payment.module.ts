import { Module } from '@nestjs/common';
import { PaymentsMessageController } from './payment-message.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://root:password@localhost:5672'],
          queue: 'order_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [PaymentsMessageController],
  providers: [],
  exports: [],
})
export class PaymentModule { }
