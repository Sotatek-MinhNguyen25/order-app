import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GetListDto } from "./dto/get-list.dto";
import { ApiBody } from "@nestjs/swagger";
import { CancelOrderDto } from "./dto/cancel-order.dto";

@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return await this.orderService.createOrder(dto);
  }

  @Post("/cancel")
  async cancelOrder(@Body() dto: CancelOrderDto) {
    return await this.orderService.cancelOrder(dto.orderId);
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
