import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: "https://cb886cd8649348e3b402c8fd36ab30bc@o1081909.ingest.us.sentry.io/6410746",
  environment: process.env.NODE_ENV === "production" ? "production" : "staging",
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
