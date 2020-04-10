import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

// TODO: this isn't used!
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200', 'http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/\.planninglabs\.nyc$/, /\.planning\.nyc\.gov$/,'http://localhost:4200','http://localhost:3000', /\.netlify\.com/],
      credentials: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
