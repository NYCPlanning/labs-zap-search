import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

describe('Project Controller', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          // how you provide the injection token in a test instance
          useValue: new (class ProjectServiceMock { }),
        },
        {
          provide: ConfigService,
          useValue: new (class ConfigServiceMock { }),
        }
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
