import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IMailServiceToken } from './mail.constants';
import { IMailService } from './mail.interface';
import { NOTIFICATION_CONSTANTS } from 'src/constants';

@Controller()
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(
    @Inject(IMailServiceToken) private readonly mailProvider: IMailService,
  ) { }

  @EventPattern(NOTIFICATION_CONSTANTS.EVENTS.ORDER_SEND_MAIL)
  sendMailStatusOrder(@Payload() data: any) {
    const { to, order } = data;
    this.logger.log(`Nhận yêu cầu gửi mail đến: ${to}, orderId: ${order.id}`);
    return this.mailProvider.sendOrderStatusMail(to, order);
  }
}
