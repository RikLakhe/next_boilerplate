import { RequestType } from "@prisma/client";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateAuditLogsDto {
  @IsString()
  @IsNotEmpty()
  entity!: string;

  @IsNumber()
  @IsNotEmpty()
  entityId!: number;

  @IsNotEmpty()
  oldValue!: object;

  @IsNotEmpty()
  newValue!: object;

  @IsString()
  @IsNotEmpty()
  requestType!: RequestType;

  @IsNumber()
  @IsNotEmpty()
  requestedBy!: number;
}
