import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const WORKSHOP_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.workshop.upsert({
    where: { id: WORKSHOP_ID },
    update: {},
    create: {
      id: WORKSHOP_ID,
      name: 'İstanbul Demir Atölyesi',
      phone: '+905551234567',
      address: 'Sanayi Sitesi C Blok No: 18',
      city: 'İstanbul',
      state: 'Marmara',
      zipCode: '34000',
      totalStations: 4,
      timezone: 'Europe/Istanbul',
      users: {
        create: {
          email: 'demo@istanbuldemiratolyesi.com',
          passwordHash,
          firstName: 'Ali',
          lastName: 'Yılmaz',
          role: 'owner',
        },
      },
    },
  });

  const projectData = [
    { id: '00000000-0000-0000-0000-000000000101', projectNumber: 'DA-2401', clientName: 'Villa Bahçe Ltd.', projectType: 'railing' as const, quantity: 24, status: 'welding' as const, stationName: 'MIG-1' },
    { id: '00000000-0000-0000-0000-000000000102', projectNumber: 'DA-2402', clientName: 'Konut Yapı A.Ş.', projectType: 'balcony' as const, quantity: 8, status: 'fabricating' as const, stationName: 'TIG-2' },
    { id: '00000000-0000-0000-0000-000000000103', projectNumber: 'DA-2403', clientName: 'Park Sitesi', projectType: 'gate' as const, quantity: 2, status: 'finishing' as const, stationName: 'MIG-1' },
    { id: '00000000-0000-0000-0000-000000000104', projectNumber: 'DA-2404', clientName: 'Mermer Plaza', projectType: 'canopy' as const, quantity: 1, status: 'installed' as const, stationName: 'TIG-2' },
    { id: '00000000-0000-0000-0000-000000000105', projectNumber: 'DA-2405', clientName: 'Özel Müşteri', projectType: 'staircase' as const, quantity: 1, status: 'quoted' as const },
    { id: '00000000-0000-0000-0000-000000000106', projectNumber: 'DA-2406', clientName: 'Rezidans Proje', projectType: 'railing' as const, quantity: 16, status: 'designing' as const, stationName: 'MIG-1' },
  ];

  const projects = [];
  for (const p of projectData) {
    const project = await prisma.fabricationProject.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, workshopId: WORKSHOP_ID, dueDate: new Date() },
    });
    projects.push(project);
  }

  const stockData = [
    { id: '00000000-0000-0000-0000-000000000201', lotName: 'Kare Profil 40x40', materialGrade: 'S235JR', quantityKg: 850.0, materialUnit: 'bar' as const, status: 'in_stock' as const, projectId: projects[0].id },
    { id: '00000000-0000-0000-0000-000000000202', lotName: 'Sac Levha 3mm', materialGrade: 'DX51D', quantityKg: 420.0, materialUnit: 'sheet' as const, status: 'low' as const, projectId: projects[1].id },
    { id: '00000000-0000-0000-0000-000000000203', lotName: 'Galvaniz Boru Ø50', materialGrade: 'EN10255', quantityKg: 180.0, materialUnit: 'coil' as const, status: 'reorder' as const },
  ];

  for (const stock of stockData) {
    await prisma.materialStock.upsert({
      where: { id: stock.id },
      update: {},
      create: {
        ...stock,
        workshopId: WORKSHOP_ID,
        receivedAt: stock.status !== 'reorder' ? new Date() : undefined,
      },
    });
  }

  const visitedAt = new Date();
  visitedAt.setDate(visitedAt.getDate() - 3);

  await prisma.siteVisit.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      workshopId: WORKSHOP_ID,
      projectId: projects[0].id,
      visitedAt,
      measurementQuality: 'excellent',
      revisionNotes: null,
      status: 'approved',
      notes: 'Ölçüler onaylandı — üretime geçilebilir',
    },
  });

  await prisma.siteVisit.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      workshopId: WORKSHOP_ID,
      projectId: projects[2].id,
      visitedAt: new Date(),
      measurementQuality: 'needs_review',
      revisionNotes: 'Kapı genişliği 5cm daraltılacak',
      status: 'revision',
      notes: 'Müşteri revizyon istedi — yeni ölçü alınacak',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.weldingTask.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      workshopId: WORKSHOP_ID,
      title: 'MIG-1 Nozul Değişimi',
      description: 'Kaynak nozulu ve gaz hortumu kontrolü',
      category: 'mig',
      stationName: 'MIG-1',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.weldingTask.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      workshopId: WORKSHOP_ID,
      title: 'TIG-2 Tungsten Ucu',
      category: 'tig',
      stationName: 'TIG-2',
      scheduledAt: new Date(),
      status: 'overdue',
    },
  });

  const finishes = [
    { id: '00000000-0000-0000-0000-000000000501', title: 'Sıcak Daldırma Galvaniz', surfaceCategory: 'galvanizing' as const, pricePerSqm: 85.0, leadDays: 3 },
    { id: '00000000-0000-0000-0000-000000000502', title: 'Elektrostatik Toz Boya', surfaceCategory: 'powder_coat' as const, pricePerSqm: 45.0, leadDays: 2, status: 'seasonal' as const },
    { id: '00000000-0000-0000-0000-000000000503', title: 'Antik Patina Kaplama', surfaceCategory: 'patina' as const, pricePerSqm: 120.0, leadDays: 5 },
  ];

  for (const finish of finishes) {
    await prisma.surfaceFinish.upsert({
      where: { id: finish.id },
      update: {},
      create: { ...finish, workshopId: WORKSHOP_ID, status: finish.status || 'active' },
    });
  }

  console.log('AnvilPulse seed completed');
  console.log('Demo: demo@istanbuldemiratolyesi.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
