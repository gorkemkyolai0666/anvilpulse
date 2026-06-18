import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SurfaceCategory, SurfaceStatus } from '@prisma/client';

export class CreateSurfaceFinishDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(SurfaceCategory)
  surfaceCategory?: SurfaceCategory;

  @IsOptional()
  @IsEnum(SurfaceStatus)
  status?: SurfaceStatus;

  @IsNumber()
  @Min(0)
  pricePerSqm: number;

  @IsOptional()
  @IsNumber()
  leadDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSurfaceFinishDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(SurfaceCategory)
  surfaceCategory?: SurfaceCategory;

  @IsOptional()
  @IsEnum(SurfaceStatus)
  status?: SurfaceStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqm?: number;

  @IsOptional()
  @IsNumber()
  leadDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
