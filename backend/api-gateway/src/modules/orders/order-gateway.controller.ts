import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';
import { UpdateOrderDto } from 'src/modules/orders/dto/update-order.dto';
import { GetListDto } from 'src/modules/orders/dto/get-list.dto';
import { firstValueFrom } from 'rxjs';
import { GATEWAY_CONSTANTS } from '../../constants/order.constant';
import { config } from 'src/configs/config.service';

@Controller('orders')
export class OrderGatewayController {
  constructor(
    @Inject(config.ORDER_SERVICE) private readonly orderClient: ClientProxy,
  ) { }

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return await firstValueFrom(
      this.orderClient.send(
        GATEWAY_CONSTANTS.GATEWAY.CONTROLLER.ORDER_CREATE,
        dto,
      ),
    );
  }

  @Post(':id/retry-payment')
  async retryPayment(@Param('id') id: string) {
    return await firstValueFrom(
      this.orderClient.send(
        GATEWAY_CONSTANTS.GATEWAY.CONTROLLER.ORDER_RETRY_PAYMENT,
        { id },
      ),
    );
  }

  @Patch(':orderId')
  async updateOrder(@Param('orderId') id: string, @Body() dto: UpdateOrderDto) {
    return await firstValueFrom(
      this.orderClient.send(GATEWAY_CONSTANTS.GATEWAY.CONTROLLER.ORDER_UPDATE, {
        id,
        dto,
      }),
    );
  }

  @Get()
  async getAllOrders(@Query() query: GetListDto) {
    return await firstValueFrom(
      this.orderClient.send(
        GATEWAY_CONSTANTS.GATEWAY.CONTROLLER.ORDER_GET_ALL,
        query,
      ),
    );
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') id: string) {
    return await firstValueFrom(
      this.orderClient.send(
        GATEWAY_CONSTANTS.GATEWAY.CONTROLLER.ORDER_GET_BY_ID,
        { orderId: id },
      ),
    );
  }
}
