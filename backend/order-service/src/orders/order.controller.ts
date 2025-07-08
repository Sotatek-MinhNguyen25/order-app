import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GetListDto } from "./dto/get-list.dto";
import { ResponseMessage } from "src/common/decorators";
import { OrderStatus } from "./entity/order.enum";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ResponseMessage("Create order success")
  async createOrder(@Body() dto: CreateOrderDto) {
    return await this.orderService.createOrder(dto);
  }

  @Post("/:id/retry-payment")
  @ResponseMessage("Retry payment success")
  async retryPayment(@Param('id') id: string) {
    return await this.orderService.retryPayment(id)
  }

  @Patch("/:orderId")
  @ResponseMessage("Update order success")
  async updateOrder(
    @Param("orderId") orderId: string,
    @Body() dto: UpdateOrderDto
  ) {
    return await this.orderService.updateOrder(orderId, dto.status);
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
