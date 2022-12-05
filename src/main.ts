if ('local' !== process.env.NODE_ENV) {
  require('module-alias/register');
}

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { I18nService } from 'nestjs-i18n';
import { HttpExceptionFilter } from './filters/http-exception.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { SharedModule } from '@/shared/shared.module';
import { ConfigService } from '@/shared/services/config.service';
import { LoggerFactory } from '@/shared/services/logger.service';

const bodyParser = require('body-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.select(SharedModule).get(ConfigService);
  const i18nService = app.select(AppModule).get(I18nService);
  LoggerFactory.setLevel(configService.logLevel);

  app.useGlobalFilters(new HttpExceptionFilter(i18nService));
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // dismissDefaultMessages: true,
      validationError: {
        target: false,
      },
    }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // const corsOptions: CorsOptions = {
  //   Headers
  //   origin: '*',
  //   allowedHeaders: ['Content-Type', 'Authorization', 'Language', 'Content-Disposition', 'Timezone'],
  //   optionsSuccessStatus: 200,
  //   methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  //   exposedHeaders: ['Content-Disposition'],
  // };

  // app.enableCors(corsOptions);
  app.enableCors();

  setupSwagger(app, configService.basePath);
  const logger = LoggerFactory.create('bootstrap');
  await app.listen(configService.port);
  logger.log(`Server running on port ${configService.port}`);
}
bootstrap();
