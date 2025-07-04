import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { RabbitMQModule } from './base/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    RabbitMQModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
