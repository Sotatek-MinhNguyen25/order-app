import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { OrderService } from "./order.service";
import { ORDER_CONSTANTS } from "src/constants";

@Controller()
export class OrdersMessageController {
  private readonly logger = new Logger(OrdersMessageController.name);

  constructor(private readonly orderService: OrderService) {}

  @EventPattern(ORDER_CONSTANTS.EVENTS.ORDER_PAYMENT_RESULT)
  async handleResult(@Payload() data: { orderId: string; status: string }) {
    this.logger.log(`📩 Received payment result: ${JSON.stringify(data)}`);
    await this.orderService.handlePaymentResult(data);
  }
}
