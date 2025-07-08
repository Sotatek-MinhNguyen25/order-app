import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Query,
    Body,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { UpdateOrderDto } from 'src/dto/update-order.dto';
import { GetListDto } from 'src/dto/get-list.dto';
import { config } from 'src/configs/config.service';

@Controller('orders')
export class OrderGatewayController {
    private readonly ORDER_SERVICE_URL = `http://${config.ORDER_HOST}:${config.ORDER_PORT}/${config.API_PREFIX}/orders`;

    constructor(private readonly httpService: HttpService) { }

    @Post()
    async createOrder(@Body() dto: CreateOrderDto) {
        const res$ = this.httpService.post(`${this.ORDER_SERVICE_URL}`, dto);
        const response = await firstValueFrom(res$);
        return response.data;
    }

    @Post(':id/retry-payment')
    async retryPayment(@Param('id') id: string) {
        const res$ = this.httpService.post(`${this.ORDER_SERVICE_URL}/${id}/retry-payment`);
        const response = await firstValueFrom(res$);
        return response.data;
    }

    @Patch(':orderId')
    async updateOrder(@Param('orderId') orderId: string, @Body() dto: UpdateOrderDto) {
        const res$ = this.httpService.patch(`${this.ORDER_SERVICE_URL}/${orderId}`, dto);
        const response = await firstValueFrom(res$);
        return response.data;
    }

    @Get()
    async getAllOrders(@Query() query: GetListDto) {
        const res$ = this.httpService.get(`${this.ORDER_SERVICE_URL}`, { params: query });
        const response = await firstValueFrom(res$);
        return response.data;
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId') orderId: string) {
        const res$ = this.httpService.get(`${this.ORDER_SERVICE_URL}/${orderId}`);
        const response = await firstValueFrom(res$);
        return response.data;
    }
}
