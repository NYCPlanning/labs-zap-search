import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ZoningResolutionsController } from './zoning-resolutions.controller';

@Module({
  imports: [
    CrmModule,
  ],
  providers: [],
  exports: [],
  controllers: [ZoningResolutionsController],
})
export class ZoningResolutionsModule {}
