import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopService {
  constructor(private prisma: PrismaService) {}

  get(workshopId: string) {
    return this.prisma.workshop.findUnique({ where: { id: workshopId } });
  }

  update(workshopId: string, dto: UpdateWorkshopDto) {
    return this.prisma.workshop.update({ where: { id: workshopId }, data: dto });
  }
}
