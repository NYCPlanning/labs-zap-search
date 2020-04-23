import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth/auth.service';
import { ContactService } from './contact/contact.service';
import { AppController } from './app.controller';

describe('App Controller', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          // how you provide the injection token in a test instance
          useValue: new (class Mock { }),
        },
        {
          provide: ContactService,
          // how you provide the injection token in a test instance
          useValue: new (class Mock { }),
        },
      ],
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
