import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeldingDto, UpdateWeldingDto } from './dto/welding.dto';

@Injectable()
export class WeldingService {
  constructor(private prisma: PrismaService) {}

  async list(workshopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { workshopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.weldingTask.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.weldingTask.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(workshopId: string, id: string) {
    const item = await this.prisma.weldingTask.findFirst({
      where: { id, workshopId },
    });
    if (!item) throw new NotFoundException('Welding task not found');
    return item;
  }

  async create(workshopId: string, dto: CreateWeldingDto) {
    return this.prisma.weldingTask.create({
      data: {
        ...dto,
        workshopId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(workshopId: string, id: string, dto: UpdateWeldingDto) {
    await this.get(workshopId, id);
    const { scheduledAt, ...rest } = dto;
    return this.prisma.weldingTask.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
    });
  }

  async remove(workshopId: string, id: string) {
    await this.get(workshopId, id);
    return this.prisma.weldingTask.delete({ where: { id } });
  }
}
