import { IsNumber } from "class-validator";
import { CreateLeaveTypeDto } from "./create-leaveType.dto";

export class UpdateLeaveTypeDto extends CreateLeaveTypeDto {
  @IsNumber()
  id: number;
}
