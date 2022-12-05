import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@/shared/services/config.service';
import { SharedModule } from '@/shared/shared.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.redisCfg.host,
          port: Number(configService.redisCfg.port),
          username: configService.redisCfg.user,
          password: configService.redisCfg.pass,
        },
        defaultJobOptions: {
          backoff: Number(configService.redisQueue.backoff),
          attempts: Number(configService.redisQueue.attempts),
          removeOnComplete: Boolean(configService.redisQueue.removeOnComplete),
          removeOnFail: Boolean(configService.redisQueue.removeOnFail),
        },
      }),
    }),
  ],
})
export class QueueModule {}
