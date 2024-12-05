import { Module } from "@nestjs/common";
import { SendUpdateController } from "./send-update.controller";
import { SendUpdateService } from "./send-update.service";
import { ProjectService } from "../project/project.service";
import { Client } from "@sendgrid/client";
import { MailService } from "@sendgrid/mail";
import { ProjectModule } from "../project/project.module";
import { ArtifactModule } from "../artifact/artifact.module";
import { PackageModule } from "../package/package.module";
import { ConfigModule } from "../config/config.module";
import { CartoModule } from "../carto/carto.module";
import { CrmModule } from "../crm/crm.module";
import { DocumentModule } from "../document/document.module";
import { DispositionModule } from "../disposition/disposition.module";
import { GeometryService } from "../project/geometry/geometry.service";
import { ListservAuthModule } from "../listserv/auth.module";
import { ListservAuthService } from "../listserv/auth.service";

@Module({
  imports: [
    ConfigModule,
    ProjectModule,
    ArtifactModule,
    PackageModule,
    ConfigModule,
    CartoModule,
    CrmModule,
    DispositionModule,
    DocumentModule,
    ListservAuthModule,
  ],
  providers: [SendUpdateService, Client, MailService, ProjectService, GeometryService, ListservAuthService],
  exports: [SendUpdateService],
  controllers: [SendUpdateController]
})
export class SendUpdateModule {}
