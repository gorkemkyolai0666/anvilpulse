import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async list(workshopId: string, params: { page?: number; status?: string; clientName?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { workshopId };
    if (params.status) where.status = params.status;
    if (params.clientName) where.clientName = { contains: params.clientName, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.fabricationProject.findMany({
        where,
        orderBy: [{ dueDate: 'asc' }, { projectNumber: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          siteVisits: {
            orderBy: { visitedAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.fabricationProject.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(workshopId: string, id: string) {
    const job = await this.prisma.fabricationProject.findFirst({
      where: { id, workshopId },
      include: {
        siteVisits: { orderBy: { visitedAt: 'desc' }, take: 5 },
        materialStock: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!job) throw new NotFoundException('Fabrication project not found');
    return job;
  }

  async create(workshopId: string, dto: CreateProjectDto) {
    return this.prisma.fabricationProject.create({ data: { ...dto, workshopId } });
  }

  async update(workshopId: string, id: string, dto: UpdateProjectDto) {
    await this.get(workshopId, id);
    return this.prisma.fabricationProject.update({ where: { id }, data: dto });
  }

  async remove(workshopId: string, id: string) {
    await this.get(workshopId, id);
    return this.prisma.fabricationProject.delete({ where: { id } });
  }
}
