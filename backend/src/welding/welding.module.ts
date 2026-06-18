import { Module } from '@nestjs/common';
import { WeldingController } from './welding.controller';
import { WeldingService } from './welding.service';

@Module({
  controllers: [WeldingController],
  providers: [WeldingService],
})
export class WeldingModule {}
