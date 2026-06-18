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
import { SurfaceFinishesService } from './surface-finishes.service';
import { CreateSurfaceFinishDto, UpdateSurfaceFinishDto } from './dto/surface-finish.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('surface-finishes')
@UseGuards(JwtAuthGuard)
export class SurfaceFinishesController {
  constructor(private finishesService: SurfaceFinishesService) {}

  @Get()
  list(
    @Request() req: { user: { workshopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.finishesService.list(req.user.workshopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.finishesService.get(req.user.workshopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { workshopId: string } },
    @Body() dto: CreateSurfaceFinishDto,
  ) {
    return this.finishesService.create(req.user.workshopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { workshopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateSurfaceFinishDto,
  ) {
    return this.finishesService.update(req.user.workshopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.finishesService.remove(req.user.workshopId, id);
  }
}
