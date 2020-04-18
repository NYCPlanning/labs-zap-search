import * as dotenv from 'dotenv';
import * as fs from 'fs';

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

      console.log(`${key}: ${printedValue.slice(0,5)}...`);
    });
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
