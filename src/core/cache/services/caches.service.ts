import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache(key: string) {
    return await this.cacheManager.get(key);
  }

  async setCache(key: string, value: string, ttl?: number) {
    return await this.cacheManager.set(key, value, { ttl });
  }

  async getObjectCache(key: string) {
    return JSON.parse(await this.cacheManager.get(key));
  }

  async setObjectCache(key: string, value: any, ttl?: number) {
    return await this.cacheManager.set(key, JSON.stringify(value), { ttl });
  }

  async delCache(key: string) {
    return await this.cacheManager.del(key);
  }

  async clearAllCache() {
    return await this.cacheManager.reset();
  }
}
