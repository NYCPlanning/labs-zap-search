import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CrmModule } from '../crm/crm.module';

describe('Document Controller', () => {
  let controller: DocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        CrmModule,
      ],
      providers: [DocumentService],
      controllers: [DocumentController],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
