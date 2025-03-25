import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { SentryModule } from "@sentry/nestjs/setup";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";
import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import compression from "compression";
import { AuthMiddleware } from "./auth.middleware";
import { ConfigModule } from "./config/config.module";
import { ProjectModule } from "./project/project.module";
import { AppController } from "./app.controller";
import { ContactModule } from "./contact/contact.module";
import { AuthModule } from "./auth/auth.module";
import { DispositionModule } from "./disposition/disposition.module";
import { AssignmentModule } from "./assignment/assignment.module";
import { DocumentModule } from "./document/document.module";
import { CrmModule } from "./crm/crm.module";
import { ZoningResolutionsModule } from "./zoning-resolutions/zoning-resolutions.module";
import { SubscriberModule } from "./subscriber/subscriber.module";
import { SendUpdateModule } from "./send-update/send-update.module";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  imports: [
    SentryModule.forRoot(),
    ProjectModule,
    ContactModule,
    ConfigModule,
    CrmModule,
    AuthModule,
    DispositionModule,
    AssignmentModule,
    DocumentModule,
    ZoningResolutionsModule,
    SubscriberModule,
    SendUpdateModule
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieparser()).forRoutes("*");

    consumer.apply(AuthMiddleware).forRoutes("*");

    consumer
      .apply(
        bodyParser.json({
          type: "application/vnd.api+json"
        })
      )
      .forRoutes("*");

    consumer.apply(compression()).forRoutes("*");
  }
}
