import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { MaterialStatus, MaterialUnit } from '@prisma/client';

export class CreateMaterialDto {
  @IsString()
  lotName: string;

  @IsOptional()
  @IsString()
  materialGrade?: string;

  @IsNumber()
  @Min(0)
  quantityKg: number;

  @IsOptional()
  @IsEnum(MaterialUnit)
  materialUnit?: MaterialUnit;

  @IsOptional()
  @IsEnum(MaterialStatus)
  status?: MaterialStatus;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  lotName?: string;

  @IsOptional()
  @IsString()
  materialGrade?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantityKg?: number;

  @IsOptional()
  @IsEnum(MaterialUnit)
  materialUnit?: MaterialUnit;

  @IsOptional()
  @IsEnum(MaterialStatus)
  status?: MaterialStatus;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
