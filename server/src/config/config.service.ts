import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string } = {};

  constructor(filePath: string) {
    if (process.env.NODE_ENV === 'production') {
      this.envConfig = process.env;
    } else {
      try {
        const envFile = dotenv.parse(fs.readFileSync(filePath)) || {};

        this.envConfig = { ...process.env, ...envFile };
      } catch (e) {
        // fallback to whatever the environment is
        this.envConfig = process.env;
      }
    }
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
