import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

jest.mock('fs');
jest.mock('dotenv');

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    service = new ConfigService('.');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
