import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ProjectStatus, ProjectType } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  projectNumber: string;

  @IsString()
  clientName: string;

  @IsOptional()
  @IsEnum(ProjectType)
  projectType?: ProjectType;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  stationName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectNumber?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  projectType?: ProjectType;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  stationName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
