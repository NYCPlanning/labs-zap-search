import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CrmModule } from '../crm/crm.module';

@Module({
  imports: [
    ConfigModule,
    CrmModule,
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
  ],
  exports: [
    DocumentService,
  ],
})
export class DocumentModule {}
