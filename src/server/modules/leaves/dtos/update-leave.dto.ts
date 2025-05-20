import { IsNumber, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateLeaveDto } from "./create-leave.dto";

export class UpdateLeaveDto extends CreateLeaveDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsOptional()
  approvedBy?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
