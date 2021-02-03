import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DispositionController } from './disposition.controller';
import { CrmService } from '../crm/crm.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [CrmService],
  controllers: [DispositionController]
})
export class DispositionModule {}
