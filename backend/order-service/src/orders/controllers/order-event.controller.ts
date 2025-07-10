import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { GetListDto } from "../dto/get-list.dto";
import { ORDER_CONSTANTS } from "src/constants";

@Controller()
export class OrderEventController {
  private readonly logger = new Logger(OrderEventController.name);

  constructor(private readonly orderService: OrderService) { }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_CREATE)
  async createOrder(@Payload() dto: CreateOrderDto) {
    this.logger.log('ORDER_CREATE');
    return this.orderService.createOrder(dto);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_RETRY_PAYMENT)
  async retryPayment(@Payload() data: { id: string }) {
    this.logger.log(`ORDER_RETRY_PAYMENT - ${data.id}`);
    return this.orderService.retryPayment(data.id);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_UPDATE)
  async updateOrder(@Payload() data: { id: string; dto: UpdateOrderDto }) {
    this.logger.log(`ORDER_UPDATE - ${data.id}`);
    return this.orderService.updateOrder(data.id, data.dto.status);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_GET_ALL)
  async getAllOrders(@Payload() dto: GetListDto) {
    this.logger.log('ORDER_GET_ALL');
    return this.orderService.getAllOrders(dto);
  }

  @MessagePattern(ORDER_CONSTANTS.GATEWAY.CONTROLLER.ORDER_GET_BY_ID)
  async getOrderById(@Payload() data: { orderId: string }) {
    this.logger.log(`ORDER_GET_BY_ID - ${data.orderId}`);
    return this.orderService.getOrderById(data.orderId);
  }
}
