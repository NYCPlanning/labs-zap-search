import { Test, TestingModule } from '@nestjs/testing';
import { ContactModule } from '../contact/contact.module';
import { OdataModule } from '../odata/odata.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

describe('Assignment Controller', () => {
  let controller: AssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ContactModule,
        OdataModule,
      ],
      controllers: [AssignmentController],
      providers: [AssignmentService],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
