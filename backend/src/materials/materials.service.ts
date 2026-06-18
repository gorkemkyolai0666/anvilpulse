import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/materials.dto';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async list(workshopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { workshopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.materialStock.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { project: { select: { projectNumber: true, clientName: true } } },
      }),
      this.prisma.materialStock.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(workshopId: string, id: string) {
    const item = await this.prisma.materialStock.findFirst({
      where: { id, workshopId },
      include: { project: true },
    });
    if (!item) throw new NotFoundException('Material stock not found');
    return item;
  }

  async create(workshopId: string, dto: CreateMaterialDto) {
    return this.prisma.materialStock.create({ data: { ...dto, workshopId } });
  }

  async update(workshopId: string, id: string, dto: UpdateMaterialDto) {
    await this.get(workshopId, id);
    return this.prisma.materialStock.update({ where: { id }, data: dto });
  }

  async remove(workshopId: string, id: string) {
    await this.get(workshopId, id);
    return this.prisma.materialStock.delete({ where: { id } });
  }
}
