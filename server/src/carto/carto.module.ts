import { Module } from '@nestjs/common';
import { CartoService } from '../carto/carto.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CartoService],
  exports:[CartoService],
})
export class CartoModule {}
