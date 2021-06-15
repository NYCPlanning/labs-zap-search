import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { DispositionController } from "./disposition.controller";
import { CrmService } from "../crm/crm.service";
import { SharepointModule } from "../sharepoint/sharepoint.module";
import { DispositionService } from "./disposition.service";

@Module({
  imports: [ConfigModule, SharepointModule],
  providers: [CrmService, DispositionService],
  exports: [DispositionService],
  controllers: [DispositionController]
})
export class DispositionModule {}
