import { Test, TestingModule } from '@nestjs/testing';
import { ContactModule } from '../contact/contact.module';
import { OdataModule } from '../odata/odata.module';
import { AssignmentService } from './assignment.service';

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ContactModule,
        OdataModule,
      ],
      providers: [AssignmentService],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
