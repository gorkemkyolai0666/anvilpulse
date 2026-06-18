import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workshop')
@UseGuards(JwtAuthGuard)
export class WorkshopController {
  constructor(private printshopService: WorkshopService) {}

  @Get()
  get(@Request() req: { user: { workshopId: string } }) {
    return this.printshopService.get(req.user.workshopId);
  }

  @Patch()
  update(
    @Request() req: { user: { workshopId: string } },
    @Body() dto: UpdateWorkshopDto,
  ) {
    return this.printshopService.update(req.user.workshopId, dto);
  }
}
