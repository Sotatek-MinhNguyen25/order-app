import { Module } from '@nestjs/common';
import { OrderGatewayModule } from './orders/order-gateway.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from './configs/config.module';

@Module({
  imports: [ConfigModule, OrderGatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
