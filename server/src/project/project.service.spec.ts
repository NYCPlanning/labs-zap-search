import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ConfigModule } from '../config/config.module';
import { TilesService } from './tiles/tiles.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
      ],
      providers: [
        ProjectService,
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(Project),
          // as a class value, Repository needs no generics
          useClass: Repository,
        },
        {
          provide: TilesService,
          // how you provide the injection token in a test instance
          useValue: new (class TilesServiceMock { }),
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
