import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { OdataService } from './odata.service';

describe('OdataService', () => {
  let service: OdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [OdataService],
    }).compile();

    service = module.get<OdataService>(OdataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
