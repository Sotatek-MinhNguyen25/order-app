import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/database/cache/cache.service';
import { ORDER_CONSTANTS } from 'src/constants';
import { OrderEntity } from '../entity/order.entity';
import { GetListDto } from '../dto/get-list.dto';
import { GenerateKeyCacheHelper } from '../helpers/generate-key-cache.helper';
import { PaginatedOrderResponse } from '../dto/order-response.dto';

@Injectable()
export class OrderCacheService {
  constructor(private readonly cacheService: CacheService) { }

  async getOrderById(id: string): Promise<OrderEntity | null> {
    const key = `order:${id}`;
    return this.cacheService.get<OrderEntity>(key);
  }

  async setOrder(order: OrderEntity): Promise<void> {
    const key = `order:${order.id}`;
    await this.cacheService.set(key, order, ORDER_CONSTANTS.CACHE.DETAIL.ORDER_TTL);
  }

  async delOrder(id: string): Promise<void> {
    const key = `order:${id}`;
    await this.cacheService.del(key);
  }

  async getOrderList(dto: GetListDto): Promise<PaginatedOrderResponse | null> {
    const key = GenerateKeyCacheHelper(dto);
    return this.cacheService.get<PaginatedOrderResponse>(key);
  }

  async setOrderList(dto: GetListDto, value: any): Promise<void> {
    const key = GenerateKeyCacheHelper(dto);
    await this.cacheService.set(key, value, ORDER_CONSTANTS.CACHE.LIST.ORDER_TTL);
  }

  async clearOrderListCache(): Promise<void> {
    await this.cacheService.delByPrefix('order:list:');
  }
}
