import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactService } from './contact.service';

@Module({
  imports: [
    CrmModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
