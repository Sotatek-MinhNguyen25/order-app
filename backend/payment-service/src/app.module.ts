import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { RabbitMQModule } from './base/rabbitmq/rabbitmq.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    // Global
    ConfigModule,

    RabbitMQModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
