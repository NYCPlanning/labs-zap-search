import { Module } from '@nestjs/common';
import { OdataModule } from '../odata/odata.module';
import { ContactService } from './contact.service';

@Module({
  imports: [
    OdataModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
