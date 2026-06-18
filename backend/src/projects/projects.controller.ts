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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private jobsService: ProjectsService) {}

  @Get()
  list(
    @Request() req: { user: { workshopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('clientName') clientName?: string,
  ) {
    return this.jobsService.list(req.user.workshopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      clientName,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.jobsService.get(req.user.workshopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { workshopId: string } },
    @Body() dto: CreateProjectDto,
  ) {
    return this.jobsService.create(req.user.workshopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { workshopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.jobsService.update(req.user.workshopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.jobsService.remove(req.user.workshopId, id);
  }
}
