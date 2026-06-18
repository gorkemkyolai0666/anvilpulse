import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { WorkshopModule } from './workshop/workshop.module';
import { ProjectsModule } from './projects/projects.module';
import { MaterialsModule } from './materials/materials.module';
import { SiteVisitsModule } from './site-visits/site-visits.module';
import { WeldingModule } from './welding/welding.module';
import { SurfaceFinishesModule } from './surface-finishes/surface-finishes.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    WorkshopModule,
    ProjectsModule,
    MaterialsModule,
    SiteVisitsModule,
    WeldingModule,
    SurfaceFinishesModule,
    DashboardModule,
  ],
})
export class AppModule {}
