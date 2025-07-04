import { Global, Module } from "@nestjs/common";
import { OrderConfig } from "./order-config.service";

@Global()
@Module({
  providers: [OrderConfig],
  exports: [OrderConfig]
})
export class ConfigModule {}
