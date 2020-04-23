import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispositionController } from './disposition.controller';
import { Disposition } from './disposition.entity';
import { OdataService } from '../odata/odata.service';
import { ConfigService } from '../config/config.service';

describe('Disposition Controller', () => {
  let controller: DispositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OdataService,
          useValue: new (class OdataServiceMock { }),
        },
        {
          provide: ConfigService,
          useValue: new (class ConfigServiceMock { }),
        },
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(Disposition),
          // as a class value, Repository needs no generics
          useClass: Repository,
        },
      ],
      controllers: [DispositionController],
    }).compile();

    controller = module.get<DispositionController>(DispositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
