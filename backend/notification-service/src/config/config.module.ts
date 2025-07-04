import { Global, Module } from '@nestjs/common';
import { NotificationConfig } from './notification-config.service';

@Global()
@Module({
  providers: [NotificationConfig],
  exports: [NotificationConfig],
})
export class ConfigModule {}
