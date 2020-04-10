import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { OdataModule } from '../odata/odata.module';
import { ContactService } from './contact.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    OdataModule,
    ConfigModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
