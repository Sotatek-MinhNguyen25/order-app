import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [MailModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
