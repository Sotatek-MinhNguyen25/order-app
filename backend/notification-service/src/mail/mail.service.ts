import { Injectable, Inject } from '@nestjs/common';
import { IMailService } from './mail.interface';
import { IMailServiceToken } from './mail.constants';

@Injectable()
export class MailService {
  constructor(
    @Inject(IMailServiceToken)
    private readonly mailProvider: IMailService,
  ) { }

  sendMailStatusOrder(order, toEmail: string) {
    this.mailProvider.sendOrderStatusMail(toEmail, {
      id: order.id,
      productName: order.productName,
      amount: order.amount,
      status: order.status,
    });
  }
}
