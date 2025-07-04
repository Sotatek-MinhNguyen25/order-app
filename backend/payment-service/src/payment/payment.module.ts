import { Module } from '@nestjs/common';
import { PaymentsMessageController } from './payment-message.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from 'src/base/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [PaymentsMessageController],
  providers: [],
  exports: [],
})
export class PaymentModule {}
