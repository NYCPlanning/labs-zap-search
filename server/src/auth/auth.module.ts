import { Module } from '@nestjs/common';
import * as fetch from 'node-fetch';
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
export class AuthModule {
  SKIP_AUTH = false;
  CRM_IMPOSTER_EMAIL = 'labs_dl@planning.nyc.gov';

  // this must match what is in the eponymous env variable
  NYCID_CONSOLE_PASSWORD = 'test';

  constructor(private readonly config: ConfigService) {
    this.SKIP_AUTH = this.config.get('SKIP_AUTH');
    this.CRM_IMPOSTER_EMAIL = this.config.get('CRM_IMPOSTER_EMAIL');
    this.NYCID_CONSOLE_PASSWORD = this.config.get('NYCID_CONSOLE_PASSWORD');
  }

  onApplicationBootstrap() {
    if (this.SKIP_AUTH) {
      this._printCookieInConsole();
    }
  }

  _printCookieInConsole() {
    const { NYCID_CONSOLE_PASSWORD, CRM_IMPOSTER_EMAIL } = this;
    const mockJWT = jwt.sign({
      mail: CRM_IMPOSTER_EMAIL,
      exp: 1565932329 * 100,
    }, NYCID_CONSOLE_PASSWORD);

    // this hook gets called before the server is actually ready,
    // so delay the fetch a few seconds. TODO: make better.
    setTimeout(async () => {
      console.log('generating cookie...');

      const response = await superagent.get(`http://localhost:3000/login?accessToken=${mockJWT}`);
      const { header: { 'set-cookie': [, token] } } = response;

      console.log(`SKIP_AUTH is true! The cookie token is ${token}. Add this to your request headers.`);
    }, 3000);
  }
}
