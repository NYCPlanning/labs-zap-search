import { Module } from '@nestjs/common';
import { DocumentModule } from '../document/document.module';
import { SharepointModule } from '../sharepoint/sharepoint.module';
import { ArtifactService } from './artifact.service'

@Module({
  imports: [
    DocumentModule,
    SharepointModule,
  ],
  providers: [
    ArtifactService,
  ],
  exports: [
    ArtifactService,
  ],
  controllers: [],
})
export class ArtifactModule {}
