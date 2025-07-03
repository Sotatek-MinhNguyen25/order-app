import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GetListDto } from "./dto/get-list.dto";
import { ResponseMessage } from "src/common/decorators";

@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ResponseMessage("Create order success")
  async createOrder(@Body() dto: CreateOrderDto) {
    return await this.orderService.createOrder(dto);
  }

  @Put("/:orderId/cancel")
  @ResponseMessage("Cancel order success")
  async cancelOrder(@Param("orderId") orderId: string) {
    return await this.orderService.cancelOrder(orderId);
  }

  @Post("/:orderId/retry-payment")
  @ResponseMessage("Retry payment success")
  async retryPayment(@Param("orderId") orderId: string) {
    return await this.orderService.retryPayment(orderId);
  }

  @Get("")
  @ResponseMessage("Get list order success")
  async getAllOrders(@Query() dto: GetListDto) {
    return await this.orderService.getAllOrders(dto);
  }

  @Get("/:orderId")
  @ResponseMessage("Get order detail success")
  async getOrderById(@Param("orderId") orderId: string) {
    return await this.orderService.getOrderById(orderId);
  }
}
