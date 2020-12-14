import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { SharepointService } from './sharepoint.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    SharepointService,
  ],
  exports: [
    SharepointService,
  ],
  controllers: [],
})
export class SharepointModule {}
