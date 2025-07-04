import { Global, Module } from '@nestjs/common';
import { PaymentConfig } from './payment-config.service';

@Global()
@Module({
  providers: [PaymentConfig],
  exports: [PaymentConfig],
})
export class ConfigModule {}
