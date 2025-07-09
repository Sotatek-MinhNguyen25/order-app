// src/services/cache.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ORDER_CONSTANTS } from 'src/constants';

@Injectable()
export class CacheService {
    constructor(
        @Inject(ORDER_CONSTANTS.REDIS_CLIENT.NAME)
        private readonly redisClient: Redis,
    ) { }

    async delByPrefix(prefix: string): Promise<void> {
        const keys = await this.redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
            await this.redisClient.del(...keys);
        }
    }

    async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
