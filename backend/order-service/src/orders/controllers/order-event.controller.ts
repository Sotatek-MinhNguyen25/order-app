import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { GetListDto } from '../dto/get-list.dto';

@Controller()
export class OrderEventController {
    constructor(private readonly orderService: OrderService) { }

    @MessagePattern('order.create')
    async createOrder(@Payload() dto: CreateOrderDto) {
        return await this.orderService.createOrder(dto);
    }

    @MessagePattern('order.retry_payment')
    async retryPayment(@Payload() data: { id: string }) {
        return await this.orderService.retryPayment(data.id);
    }

    // @MessagePattern('order.update')
    // async updateOrder(@Payload() data: { orderId: string; status: string }) {
    //     return await this.orderService.updateOrder(data.orderId, data.status);
    // }

    @MessagePattern('order.get_all')
    async getAllOrders(@Payload() dto: GetListDto) {
        return await this.orderService.getAllOrders(dto);
    }

    @MessagePattern('order.get_by_id')
    async getOrderById(@Payload() data: { orderId: string }) {
        return await this.orderService.getOrderById(data.orderId);
    }
}
