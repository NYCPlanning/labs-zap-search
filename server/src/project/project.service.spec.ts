import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { CartoService } from '../carto/carto.service';
import { ConfigModule } from '../config/config.module';
import { OdataModule } from '../odata/odata.module';
import { ProjectController } from './project.controller';
import { CrmModule } from '../crm/crm.module';
import { DocumentModule } from '../document/document.module';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        OdataModule,
        ConfigModule,
        CrmModule,
        DocumentModule,
      ],
      controllers: [ProjectController],
      providers: [ProjectService, CartoService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
