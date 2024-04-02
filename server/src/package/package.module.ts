import { Module } from "@nestjs/common";
import { SharepointModule } from "../sharepoint/sharepoint.module";
import { PackageService } from "./package.service";

@Module({
  imports: [SharepointModule],
  providers: [PackageService],
  exports: [PackageService],
  controllers: []
})
export class PackageModule {}
