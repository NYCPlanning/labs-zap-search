import { Module } from '@nestjs/common';
import { ListservAuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [ListservAuthService],
})
export class ListservAuthModule {}
