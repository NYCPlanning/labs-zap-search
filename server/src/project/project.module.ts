import { Module } from "@nestjs/common";
import { ArtifactModule } from "../artifact/artifact.module";
import { PackageModule } from "../package/package.module";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ConfigModule } from "../config/config.module";
import { CartoModule } from "../carto/carto.module";
import { CrmModule } from "../crm/crm.module";
import { DocumentModule } from "../document/document.module";
import { GeometryService } from "./geometry/geometry.service";
import { DispositionModule } from "../disposition/disposition.module";

@Module({
  imports: [
    ArtifactModule,
    PackageModule,
    ConfigModule,
    CartoModule,
    CrmModule,
    DispositionModule,
    DocumentModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService, GeometryService]
})
export class ProjectModule {}
