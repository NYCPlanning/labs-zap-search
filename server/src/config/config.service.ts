import * as dotenv from 'dotenv';
import * as fs from 'fs';

const REQUIRED_ENV_KEYS = [
  'ADO_PRINCIPAL',
  'AUTHORITY_HOST_URL',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'CRM_ADMIN_SERVICE_USER',
  'CRM_HOST',
  'CRM_SIGNING_SECRET',
  'CRM_URL_PATH',
  'GITHUB_ACCESS_TOKEN',
  'NYCID_CONSOLE_PASSWORD',
  'RECAPTCHA_SECRET_KEY',
  'RECAPTCHA_SITE_KEY',
  'SHAREPOINT_CLIENT_ID',
  'SHAREPOINT_CLIENT_SECRET',
  'SHAREPOINT_CRM_SITE',
  'SHAREPOINT_TARGET_HOST',
  'TENANT_ID',
  'TOKEN_PATH',
];

export class ConfigService {
  private readonly envConfig: { [key: string]: string } = {};
  private readonly envValuesFromFile: { [key: string]: string } = {};

  constructor(filePath: string) {
    // prefer the regular env for prod or test. in test, we mock process.env.
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      this.envConfig = process.env;
    } else {
      try {
        this.envValuesFromFile = dotenv.parse(fs.readFileSync(filePath)) || {};

        this.envConfig = { ...process.env, ...this.envValuesFromFile };
      } catch (e) {
        console.log(`Something went wrong loading the environment file: ${e}`);

        // fallback to whatever the environment is
        this.envConfig = process.env;
      }
    }
  }

  printValues() {
    console.log('Environment Variables Loaded:');

    Object.entries(this.envValuesFromFile).forEach(([key, value]) => {
      const printedValue = `${value}`;

      console.log(`${key}: ${printedValue.slice(0,10)}...`);
    });

    const missingKeys = REQUIRED_ENV_KEYS.filter(envKey => !Object.keys(this.envConfig).includes(envKey));

    if (missingKeys.length) {
      console.log(`
        WARNING: Missing environment keys:

        ${missingKeys.join(', ')}
      `);
    }
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
