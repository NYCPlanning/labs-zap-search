import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DispositionController } from './disposition.controller';
import { OdataService } from '../odata/odata.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [OdataService],
  controllers: [DispositionController]
})
export class DispositionModule {}
