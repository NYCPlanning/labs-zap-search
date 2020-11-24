import { Test, TestingModule } from '@nestjs/testing';
import { XmlService } from './xml.service';

describe('XmlService', () => {
  let service: XmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XmlService],
    }).compile();

    service = module.get<XmlService>(XmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
