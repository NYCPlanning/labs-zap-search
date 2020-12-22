import { Module } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as superagent from 'superagent';
import { AuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';
import { ContactModule } from '../contact/contact.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule,
    ContactModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
