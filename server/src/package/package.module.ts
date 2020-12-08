import { Module } from '@nestjs/common';
import { DocumentModule } from '../document/document.module';
import { SharepointModule } from '../sharepoint/sharepoint.module';
import { PackageService } from './package.service'

@Module({
  imports: [
    DocumentModule,
    SharepointModule,
  ],
  providers: [
    PackageService,
  ],
  exports: [
    PackageService,
  ],
  controllers: [],
})
export class PackageModule {}
