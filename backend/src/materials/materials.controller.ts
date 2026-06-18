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
import { MaterialsService } from './materials.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/materials.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private materialStockService: MaterialsService) {}

  @Get()
  list(
    @Request() req: { user: { workshopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.materialStockService.list(req.user.workshopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.materialStockService.get(req.user.workshopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { workshopId: string } },
    @Body() dto: CreateMaterialDto,
  ) {
    return this.materialStockService.create(req.user.workshopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { workshopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateMaterialDto,
  ) {
    return this.materialStockService.update(req.user.workshopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { workshopId: string } }, @Param('id') id: string) {
    return this.materialStockService.remove(req.user.workshopId, id);
  }
}
