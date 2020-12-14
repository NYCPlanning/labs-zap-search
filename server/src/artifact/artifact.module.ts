import { Module } from '@nestjs/common';
import { SharepointModule } from '../sharepoint/sharepoint.module';
import { ArtifactService } from './artifact.service'

@Module({
  imports: [
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
