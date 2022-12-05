import { ConfigService } from '@/shared/services/config.service';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantProvider } from '@khanh.tran/nestjs-crud-base';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        replication: {
          master: {
            host: configService.dbWrite.host,
            port: configService.dbWrite.port,
            username: configService.dbWrite.user,
            password: configService.dbWrite.pass,
            database: configService.dbWrite.name,
          },
          slaves: [
            {
              host: configService.dbRead.host,
              port: configService.dbRead.port,
              username: configService.dbRead.user,
              password: configService.dbRead.pass,
              database: configService.dbRead.name,
            },
          ],
        },
        entities: ['dist/core/**/entities/*.entity.{ts,js}', 'dist/modules/**/entities/*.entity.{ts,js}'],
        logging: true,
        synchronize: true,
        migrationsRun: true,
        migrationsTransactionMode: 'each',
        cache: {
          duration: configService.queryResultCacheConfig.tl,
          options: {
            host: configService.queryResultCacheConfig.host,
            port: configService.queryResultCacheConfig.port,
          },
        },
      }),
    }),
  ],
  providers: [TenantProvider],
  exports: [TenantProvider],
})
export class DatabaseModule {}
