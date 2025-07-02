import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GetListDto } from "./dto/get-list.dto";

@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return await this.orderService.createOrder(dto);
  }

  @Put("/:orderId/cancel")
  async cancelOrder(@Param("orderId") orderId) {
    return await this.orderService.cancelOrder(orderId);
  }

  @Post("/:orderId/retry-payment")
  async retryPayment(@Param("orderId") orderId) {
    return await this.orderService.retryPayment(orderId);
  }

  @Get("")
  async getAllOrders(@Query() dto: GetListDto) {
    return await this.orderService.getAllOrders(dto);
  }

  @Get("/:orderId")
  async getOrderById(@Param("orderId") orderId: string) {
    return await this.orderService.getOrderById(orderId);
  }
}
