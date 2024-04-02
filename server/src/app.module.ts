import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
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

@Module({
  imports: [
    ProjectModule,
    ContactModule,
    ConfigModule,
    CrmModule,
    AuthModule,
    DispositionModule,
    AssignmentModule,
    DocumentModule,
    ZoningResolutionsModule
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
