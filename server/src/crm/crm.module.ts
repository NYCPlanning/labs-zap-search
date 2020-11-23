import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CrmService } from '../crm/crm.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
