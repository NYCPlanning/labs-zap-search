import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { SharepointService } from './sharepoint.service';
import { MsalProvider } from '../provider/msal.provider';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    SharepointService, MsalProvider
  ],
  exports: [
    SharepointService,
  ],
  controllers: [],
})
export class SharepointModule {}
