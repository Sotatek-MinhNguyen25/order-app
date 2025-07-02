import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { OrderEntity } from "../orders/entity/order.entity";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailStatusOrder(order: OrderEntity, toEmail: string) {
    await this.mailerService.sendMail({
      to: toEmail,
      subject: "Email cập nhật trạng thái đơn hàng",
      text: "Update order status",
      template: "notification.hbs",
      context: {
        orderId: order.id,
        productName: order.productName,
        amount: order.amount,
        status: order.status
      }
    });
  }
}
