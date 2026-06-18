import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { WeldingService } from './welding.service';
import { CreateWeldingDto, UpdateWeldingDto } from './dto/welding.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('welding')
@UseGuards(JwtAuthGuard)
export class WeldingController {
  constructor(private maintenanceService: WeldingService) {}

  @Get()
  list(
    @Request() req: { user: { workshopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.maintenanceService.list(req.user.workshopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.maintenanceService.get(req.user.workshopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { workshopId: string } },
    @Body() dto: CreateWeldingDto,
  ) {
    return this.maintenanceService.create(req.user.workshopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { workshopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateWeldingDto,
  ) {
    return this.maintenanceService.update(req.user.workshopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.maintenanceService.remove(req.user.workshopId, id);
  }
}
