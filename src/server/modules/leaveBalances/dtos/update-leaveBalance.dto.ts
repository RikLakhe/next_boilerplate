import { IsNumber, IsOptional } from "class-validator";
import { CreateLeaveBalanceDto } from "./create-leaveBalance.dto";

export class UpdateLeaveBalanceDto extends CreateLeaveBalanceDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
