import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { orderConfig } from "src/config";
import { ORDER_CONSTANTS } from "src/constants";

@Module({
  providers: [
    {
      provide: ORDER_CONSTANTS.REDIS_CLIENT.NAME,
      useFactory: () => {
        return new Redis({
          host: orderConfig.REDIS_HOST,
          port: orderConfig.REDIS_PORT
        });
      }
    }
  ],
  exports: [ORDER_CONSTANTS.REDIS_CLIENT.NAME]
})
export class RedisModule {}
