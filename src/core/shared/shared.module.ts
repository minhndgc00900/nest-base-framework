import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { UtilService } from './services/util.service';

@Global()
@Module({
  providers: [ConfigService, UtilService],
  exports: [ConfigService, UtilService],
})
export class SharedModule {}
