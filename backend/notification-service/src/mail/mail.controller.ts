import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { IMailServiceToken } from "./mail.constants";
import { SmtpMailService } from "./smtp-mail.service";
import { IMailService } from "./mail.interface";

@Controller()
export class MailController {
    constructor(@Inject(IMailServiceToken) private readonly mailProvider: IMailService) { }

    @EventPattern("order.send.mail")
    async sendMailStatusOrder(@Payload() data: any) {
        const { to, order } = data;
        console.log('Nhận yêu cầu gửi mail:', to, order);
        return await this.mailProvider.sendOrderStatusMail(to, order);
    }
}