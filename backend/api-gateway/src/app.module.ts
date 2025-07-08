import { Module } from '@nestjs/common';
import { OrderGatewayModule } from './orders/order-gateway.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [OrderGatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
