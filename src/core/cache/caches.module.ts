import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './services/caches.service';
import { ConfigService } from '@/shared/services/config.service';
import { SharedModule } from '@/shared/shared.module';

// @Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        isGlobal: true,

        host: configService.redisCfg.host,
        port: Number(configService.redisCfg.port),
        username: configService.redisCfg.user,
        password: configService.redisCfg.pass,

        ttl: Number(configService.redisCache.ttl),
        max: Number(configService.redisCache.max),
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CachesModule {}
