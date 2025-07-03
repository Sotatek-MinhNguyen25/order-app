import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from './mail.interface';

@Injectable()
export class SmtpMailService implements IMailService {
  constructor(private readonly mailerService: MailerService) { }

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
      subject: 'Cập nhật trạng thái đơn hàng',
      template: 'notification.hbs',
      context: {
        id: order.id,
        productName: order.productName,
        amount: order.amount,
        status: order.status,
      },
    });
  }
}
