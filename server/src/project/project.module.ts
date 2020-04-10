import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ConfigModule } from '../config/config.module';
import { OdataModule } from '../odata/odata.module';

@Module({
  imports: [
  	OdataModule,
  	ConfigModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
