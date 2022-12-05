import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import path = require('path');
import { SharedModule } from '@/shared/shared.module';
import { UserModule } from './core/user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { ExtractTenantIdMiddleware } from './middlewares/extract-tenant-id.middleware';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    ExtractTenantIdMiddleware,
    DatabaseModule,
    SharedModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    UserModule,
    PostsModule,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): boolean {
    consumer.apply(ExtractTenantIdMiddleware).forRoutes('*');
    return true;
  }
}
