import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { GetListDto } from "../dto/get-list.dto";
import { ORDER_CONSTANTS } from "src/constants";

@Controller()
export class OrderEventController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_CREATE)
  async createOrder(@Payload() dto: CreateOrderDto) {
    return await this.orderService.createOrder(dto);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_RETRY_PAYMENT)
  async retryPayment(@Payload() data: { id: string }) {
    return await this.orderService.retryPayment(data.id);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_UPDATE)
  async updateOrder(@Payload() data: { id: string; dto: UpdateOrderDto }) {
    return await this.orderService.updateOrder(data.id, data.dto.status);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_GET_ALL)
  async getAllOrders(@Payload() dto: GetListDto) {
    return await this.orderService.getAllOrders(dto);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_GET_BY_ID)
  async getOrderById(@Payload() data: { orderId: string }) {
    return await this.orderService.getOrderById(data.orderId);
  }
}
