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
import { notificationConfig } from 'src/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: notificationConfig.smtpHost,
        port: notificationConfig.smtpPort,
        secure: true,
        auth: {
          user: notificationConfig.smtpUser,
          pass: notificationConfig.smtpPassword,
        },
      },
      defaults: {
        from: `"${notificationConfig.smtpFromName}" <${notificationConfig.smtpFromEmail}>`,
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
export class MailModule {}
