import { Module } from '@nestjs/common';
import { SurfaceFinishesController } from './surface-finishes.controller';
import { SurfaceFinishesService } from './surface-finishes.service';

@Module({
  controllers: [SurfaceFinishesController],
  providers: [SurfaceFinishesService],
})
export class SurfaceFinishesModule {}
