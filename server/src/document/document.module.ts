import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DocumentController } from './document.controller';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [DocumentController]
})
export class DocumentModule {}
