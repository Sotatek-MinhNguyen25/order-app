import { Controller, Inject, Logger } from '@nestjs/common';
import { Payload, ClientProxy, MessagePattern } from '@nestjs/microservices';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { PAYMENT_CONSTANTS } from 'src/constants';
import { PaymentStatus } from './payment-status.enum';

@Controller()
export class PaymentsMessageController {
  private readonly logger = new Logger(PaymentsMessageController.name);

  constructor(
    @Inject(PAYMENT_CONSTANTS.SERVICES.RABBITMQ_ORDER_SERVICE)
    private readonly client: ClientProxy,
  ) { }

  @MessagePattern(PAYMENT_CONSTANTS.EVENTS.ORDER_CREATED)
  async handleOrder(@Payload() data: PaymentRequestDto) {
    this.logger.log(`📥 Received order for payment: ${JSON.stringify(data)}`);

    const isConfirmed: boolean = Math.random() > 0.5;
    const result = {
      orderId: data.orderId,
      status: isConfirmed ? PaymentStatus.CONFIRMED : PaymentStatus.DECLINED,
    };

    this.logger.log(`💸 Payment ${result.status} for order ${result.orderId}`);
    this.client.emit(PAYMENT_CONSTANTS.EVENTS.ORDER_PAYMENT_RESULT, result);
    return result;
  }
}
