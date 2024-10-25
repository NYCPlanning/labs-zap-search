// Sentry needs to be imported first
import "./sentry/instrument";

import { NestFactory } from "@nestjs/core";
import * as fs from "fs";
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

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
