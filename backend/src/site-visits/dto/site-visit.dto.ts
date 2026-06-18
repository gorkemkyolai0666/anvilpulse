import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { MeasurementQuality, SiteVisitStatus } from '@prisma/client';

export class CreateSiteVisitDto {
  @IsUUID()
  projectId: string;

  @IsDateString()
  visitedAt: string;

  @IsOptional()
  @IsEnum(MeasurementQuality)
  measurementQuality?: MeasurementQuality;

  @IsOptional()
  @IsString()
  revisionNotes?: string;

  @IsOptional()
  @IsEnum(SiteVisitStatus)
  status?: SiteVisitStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSiteVisitDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsDateString()
  visitedAt?: string;

  @IsOptional()
  @IsEnum(MeasurementQuality)
  measurementQuality?: MeasurementQuality;

  @IsOptional()
  @IsString()
  revisionNotes?: string;

  @IsOptional()
  @IsEnum(SiteVisitStatus)
  status?: SiteVisitStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
