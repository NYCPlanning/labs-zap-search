import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Contact } from '../contact/contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          // how you provide the injection token in a test instance
          useValue: new (class Mock {
            get() {}
          }),
        },
        {
          provide: ContactService,
          // how you provide the injection token in a test instance
          useValue: new (class Mock { }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
