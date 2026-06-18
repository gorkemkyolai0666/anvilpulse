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
import { SiteVisitsService } from './site-visits.service';
import { CreateSiteVisitDto, UpdateSiteVisitDto } from './dto/site-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('site-visits')
@UseGuards(JwtAuthGuard)
export class SiteVisitsController {
  constructor(private proofsService: SiteVisitsService) {}

  @Get()
  list(
    @Request() req: { user: { workshopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.proofsService.list(req.user.workshopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get('revision')
  revision(@Request() req: { user: { workshopId: string } }) {
    return this.proofsService.list(req.user.workshopId, { status: 'revision' });
  }

  @Get(':id')
  get(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.proofsService.get(req.user.workshopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { workshopId: string } },
    @Body() dto: CreateSiteVisitDto,
  ) {
    return this.proofsService.create(req.user.workshopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { workshopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateSiteVisitDto,
  ) {
    return this.proofsService.update(req.user.workshopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.proofsService.remove(req.user.workshopId, id);
  }
}
