import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload, ClientProxy } from '@nestjs/microservices';
import { PaymentRequestDto } from './dto/payment-request.dto';

@Controller()
export class PaymentsMessageController {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern('order.created')
  async handleOrder(@Payload() data: PaymentRequestDto) {
    console.log(data);
    const isConfirmed: boolean = Math.random() > 0.5;

    this.client.emit('order.payment.result', {
      orderId: data.orderId,
      status: isConfirmed ? 'confirmed' : 'declined',
    });
  }
}
