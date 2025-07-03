import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as process from 'node:process';
import { SmtpMailService } from './smtp-mail.service';
import { IMailServiceToken } from './mail.constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.MAIL_USER || 'nguyenquangminhbkimbang@gmail.com',
          pass: process.env.MAIL_PASS || 'ckaugcpovjplmfch',
        },
      },
      defaults: {
        from: `"Order App"`,
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [
    MailService,
    {
      provide: IMailServiceToken,
      useClass: SmtpMailService,
    },
  ],
  exports: [MailService],
})
export class MailModule { }
