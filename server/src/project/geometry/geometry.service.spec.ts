import { Test, TestingModule } from '@nestjs/testing';
import { GeometryService } from './geometry.service';

describe('GeometryService', () => {
  let service: GeometryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeometryService],
    }).compile();

    service = module.get<GeometryService>(GeometryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
