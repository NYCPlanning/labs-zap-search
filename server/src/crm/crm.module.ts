import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CrmService } from '../crm/crm.service';
import { XmlService } from './xml/xml.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [CrmService, XmlService],
  exports: [CrmService],
})
export class CrmModule {}
