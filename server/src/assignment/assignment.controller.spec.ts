import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from '../contact/contact.service';
import { AssignmentController } from './assignment.controller';

describe('Assignment Controller', () => {
  let controller: AssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ContactService,
          // how you provide the injection token in a test instance
          useValue: new (class ContactServiceMock { }),
        },
      ],
      controllers: [AssignmentController],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
