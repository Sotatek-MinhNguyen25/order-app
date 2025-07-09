import { Module, Global } from "@nestjs/common";
import { CacheModule, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import * as redisStore from "cache-manager-ioredis-yet";
import { CacheService } from "./cache.service";
import { orderConfig } from "src/config";
import { RedisModule } from "../redis/redis.module";

@Global()
@Module({
  imports: [
    RedisModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: orderConfig.REDIS_HOST,
        port: orderConfig.REDIS_PORT,
        showFriendlyErrorStack: true,
        maxRetriesPerRequest: 1
      }),
      isGlobal: true
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheApiModule { }
