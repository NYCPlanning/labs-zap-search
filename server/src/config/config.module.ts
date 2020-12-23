import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || 'production'}.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {
  constructor(private readonly config: ConfigService) {}

  onApplicationBootstrap() {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      this.config.printValues();
    }
  }
}
