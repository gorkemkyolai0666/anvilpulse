import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteVisitDto, UpdateSiteVisitDto } from './dto/site-visit.dto';

@Injectable()
export class SiteVisitsService {
  constructor(private prisma: PrismaService) {}

  async list(workshopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { workshopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.siteVisit.findMany({
        where,
        orderBy: { visitedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { project: { select: { projectNumber: true, clientName: true } } },
      }),
      this.prisma.siteVisit.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(workshopId: string, id: string) {
    const proof = await this.prisma.siteVisit.findFirst({
      where: { id, workshopId },
      include: { project: true },
    });
    if (!proof) throw new NotFoundException('Site visit not found');
    return proof;
  }

  async create(workshopId: string, dto: CreateSiteVisitDto) {
    return this.prisma.siteVisit.create({
      data: {
        ...dto,
        workshopId,
        visitedAt: new Date(dto.visitedAt),
      },
    });
  }

  async update(workshopId: string, id: string, dto: UpdateSiteVisitDto) {
    await this.get(workshopId, id);
    const { visitedAt, ...rest } = dto;
    return this.prisma.siteVisit.update({
      where: { id },
      data: {
        ...rest,
        ...(visitedAt ? { visitedAt: new Date(visitedAt) } : {}),
      },
    });
  }

  async remove(workshopId: string, id: string) {
    await this.get(workshopId, id);
    return this.prisma.siteVisit.delete({ where: { id } });
  }
}
