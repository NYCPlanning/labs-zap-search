import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disposition } from './disposition.entity';
import { ConfigModule } from '../config/config.module';
import { DispositionController } from './disposition.controller';
import { OdataService } from '../odata/odata.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Disposition]),
  ],
  providers: [OdataService],
  controllers: [DispositionController]
})
export class DispositionModule {}
