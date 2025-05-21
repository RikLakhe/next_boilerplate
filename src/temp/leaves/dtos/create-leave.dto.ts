import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateLeaveDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  leaveTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  fiscalYearId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  durationDays: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  managerId?: number;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
