import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateLeaveBalanceDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  leaveTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  fiscalYearId: number;

  @IsNumber()
  @IsNotEmpty()
  totalDays: number;

  @IsNumber()
  @IsOptional()
  usedDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
