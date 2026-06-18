import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { WeldingCategory, WeldingStatus } from '@prisma/client';

export class CreateWeldingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(WeldingCategory)
  category?: WeldingCategory;

  @IsOptional()
  @IsString()
  stationName?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(WeldingStatus)
  status?: WeldingStatus;
}

export class UpdateWeldingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(WeldingCategory)
  category?: WeldingCategory;

  @IsOptional()
  @IsString()
  stationName?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(WeldingStatus)
  status?: WeldingStatus;
}
