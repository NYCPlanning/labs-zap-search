import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ConfigModule } from '../config/config.module';
import { CartoModule } from '../carto/carto.module';
import { OdataModule } from '../odata/odata.module';
import { CrmModule } from '../crm/crm.module';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [
    OdataModule,
    ConfigModule,
    CartoModule,
    CrmModule,
    DocumentModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
