import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurfaceFinishDto, UpdateSurfaceFinishDto } from './dto/surface-finish.dto';

@Injectable()
export class SurfaceFinishesService {
  constructor(private prisma: PrismaService) {}

  async list(workshopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { workshopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.surfaceFinish.findMany({
        where,
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.surfaceFinish.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(workshopId: string, id: string) {
    const finish = await this.prisma.surfaceFinish.findFirst({
      where: { id, workshopId },
    });
    if (!finish) throw new NotFoundException('Surface finish not found');
    return finish;
  }

  async create(workshopId: string, dto: CreateSurfaceFinishDto) {
    return this.prisma.surfaceFinish.create({ data: { ...dto, workshopId } });
  }

  async update(workshopId: string, id: string, dto: UpdateSurfaceFinishDto) {
    await this.get(workshopId, id);
    return this.prisma.surfaceFinish.update({ where: { id }, data: dto });
  }

  async remove(workshopId: string, id: string) {
    await this.get(workshopId, id);
    return this.prisma.surfaceFinish.delete({ where: { id } });
  }
}
