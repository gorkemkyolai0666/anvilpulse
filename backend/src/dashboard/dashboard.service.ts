import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(workshopId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      workshop,
      totalProjects,
      activeProjects,
      cancelledProjects,
      totalMaterialStock,
      approvedVisits,
      pendingRevisions,
      pendingWelding,
      seasonalFinishes,
      materialWeight,
      recentVisits,
      stations,
    ] = await Promise.all([
      this.prisma.workshop.findUnique({ where: { id: workshopId } }),
      this.prisma.fabricationProject.count({ where: { workshopId } }),
      this.prisma.fabricationProject.count({
        where: { workshopId, status: { in: ['designing', 'fabricating', 'welding', 'finishing'] } },
      }),
      this.prisma.fabricationProject.count({ where: { workshopId, status: 'cancelled' } }),
      this.prisma.materialStock.count({
        where: { workshopId, status: { in: ['in_stock', 'low'] } },
      }),
      this.prisma.siteVisit.count({ where: { workshopId, status: 'approved' } }),
      this.prisma.siteVisit.count({
        where: {
          workshopId,
          status: 'revision',
          visitedAt: { lte: thirtyDaysLater },
        },
      }),
      this.prisma.weldingTask.count({
        where: {
          workshopId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.surfaceFinish.count({
        where: {
          workshopId,
          status: { in: ['seasonal', 'discontinued'] },
        },
      }),
      this.prisma.materialStock.aggregate({
        where: { workshopId, status: { in: ['in_stock', 'low', 'reorder'] } },
        _sum: { quantityKg: true },
      }),
      this.prisma.siteVisit.findMany({
        where: { workshopId },
        include: {
          project: { select: { projectNumber: true, clientName: true } },
        },
        orderBy: { visitedAt: 'desc' },
        take: 5,
      }),
      this.prisma.fabricationProject.groupBy({
        by: ['stationName'],
        where: { workshopId, stationName: { not: null } },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = workshop?.totalStations || totalProjects || 1;
    const projectThroughputRate =
      totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 1000) / 10 : 0;

    const monthlyTrend = await this.getMonthlyTrend(workshopId, sixMonthsAgo);

    return {
      totalProjects,
      activeProjects,
      cancelledProjects,
      totalCapacity,
      projectThroughputRate,
      totalMaterialStock,
      approvedVisits,
      pendingRevisions,
      pendingWelding,
      seasonalFinishes,
      materialWeight: materialWeight._sum.quantityKg || 0,
      recentVisits,
      stations: stations.map((m) => ({
        stationName: m.stationName,
        projectCount: m._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(workshopId: string, since: Date) {
    const proofs = await this.prisma.siteVisit.findMany({
      where: { workshopId, visitedAt: { gte: since } },
      select: { visitedAt: true, status: true, revisionNotes: true },
    });

    const months: Record<string, { siteVisits: number; revisions: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { siteVisits: 0, revisions: 0 };
    }

    proofs.forEach((visit) => {
      const key = `${visit.visitedAt.getFullYear()}-${String(visit.visitedAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].siteVisits++;
        if (visit.status === 'revision') months[key].revisions++;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
