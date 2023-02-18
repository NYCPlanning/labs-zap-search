import { NestFactory } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

declare const module: any;

// Attempt to insert SSL certs, if they exist
function generateSSLConfiguration() {
  try {
    return {
      httpsOptions: {
        key: fs.readFileSync(__dirname + "/../ssl/server.key"),
        cert: fs.readFileSync(__dirname + "/../ssl/server.crt")
      }
    };
  } catch (e) {
    console.log("Skipping local SSL certs: ", e);

    return {};
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        /\.planninglabs\.nyc$/,
        /\.planning\.nyc\.gov$/,
        "http://localhost:4200",
        "https://localhost:4200",
        /\.netlify\.com/,
        "https://local.planninglabs.nyc:4200",
        /\.netlify\.app/
      ],
      credentials: true
    },

    ...generateSSLConfiguration()
  });

  const filePath = `${process.env.NODE_ENV || "development"}.env`;
  const env =
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
      ? process.env
      : dotenv.parse(fs.readFileSync(filePath)) || {};

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT,
    tracesSampleRate: 0.5,
    debug: true
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
