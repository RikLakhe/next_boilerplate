import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLeaveTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  leaveId: number;

  @IsString()
  @IsNotEmpty()
  type: "request" | "approval" | "rejection" | "cancellation";

  @IsString()
  @IsOptional()
  notes?: string;
}
