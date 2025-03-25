import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as dotenv from "dotenv";
import * as fs from "fs";

// Load Sentry environment variables from process.env or development.env file
let envConfig: { [key: string]: string } = {};
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "test"
) {
  envConfig = process.env;
} else {
  try {
    const filePath = "development.env";
    const envValuesFromFile: { [key: string]: string } = {} = dotenv.parse(fs.readFileSync(filePath)) || {};

    envConfig = { ...process.env, ...envValuesFromFile };
  } catch (e) {
    console.log(`Something went wrong loading the environment file: ${e}`);

    // fallback to whatever the environment is
    envConfig = process.env;
  }
}

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT === undefined ? "local" : process.env.SENTRY_ENVIRONMENT,
  enabled: process.env.SENTRY_ENVIRONMENT === undefined ? false : true,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
