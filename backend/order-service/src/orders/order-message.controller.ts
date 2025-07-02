import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { OrderService } from "./order.service";

@Controller()
export class OrdersMessageController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern("order.payment.result")
  async handleResult(@Payload() data: { orderId: string; status: string }) {
    console.log("Received payment result:", data);
    await this.orderService.handlePaymentResult(data);
  }
}
