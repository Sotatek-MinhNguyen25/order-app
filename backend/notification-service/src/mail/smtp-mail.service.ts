import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from './mail.interface';
import { NOTIFICATION_CONSTANTS } from 'src/constants';

@Injectable()
export class SmtpMailService implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderStatusMail(
    to: string,
    order: {
      id: string;
      productName: string;
      amount: number;
      status: string;
    },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: NOTIFICATION_CONSTANTS.EMAIL_SUBJECTS.ORDER_STATUS,
      template: NOTIFICATION_CONSTANTS.EMAIL_TEMPLATES.ORDER_STATUS,
      context: {
        id: order.id,
        productName: order.productName,
        amount: order.amount,
        status: order.status,
      },
    });
  }
}
