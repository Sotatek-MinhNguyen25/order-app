import { Module } from '@nestjs/common';
import { OrderGatewayController } from './order-gateway.controller';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'src/configs/config.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: config.ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: config.ORDER_HOST,
          port: config.ORDER_PORT,
        },
      },
    ]),
  ],
  controllers: [OrderGatewayController],
  exports: [],
})
export class OrderGatewayModule {}
