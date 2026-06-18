import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    workshop: { findUnique: jest.fn() },
    fabricationProject: { count: jest.fn(), groupBy: jest.fn() },
    materialStock: { count: jest.fn(), aggregate: jest.fn() },
    siteVisit: {
      count: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    weldingTask: { count: jest.fn() },
    surfaceFinish: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return dashboard stats', async () => {
    mockPrisma.workshop.findUnique.mockResolvedValue({ totalStations: 4 });
    mockPrisma.fabricationProject.count.mockResolvedValue(10);
    mockPrisma.materialStock.count.mockResolvedValue(8);
    mockPrisma.siteVisit.count.mockResolvedValue(5);
    mockPrisma.materialStock.aggregate.mockResolvedValue({ _sum: { quantityKg: 220.5 } });
    mockPrisma.siteVisit.findMany.mockResolvedValue([]);
    mockPrisma.weldingTask.count.mockResolvedValue(2);
    mockPrisma.surfaceFinish.count.mockResolvedValue(1);
    mockPrisma.fabricationProject.groupBy.mockResolvedValue([
      { stationName: 'MIG-1', _count: { id: 5 } },
    ]);

    const stats = await service.getStats('workshop-1');

    expect(stats).toHaveProperty('projectThroughputRate');
    expect(stats).toHaveProperty('materialWeight', 220.5);
    expect(stats).toHaveProperty('stations');
    expect(stats).toHaveProperty('pendingRevisions');
    expect(stats).toHaveProperty('pendingWelding');
    expect(stats).toHaveProperty('seasonalFinishes');
  });
});
