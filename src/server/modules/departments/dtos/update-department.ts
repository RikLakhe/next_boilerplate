import { IsOptional, IsNumber } from "class-validator";
import { CreateDepartmentDto } from "./create-department.dto";

export class UpdateDepartmentDto extends CreateDepartmentDto {
  @IsNumber()
  @IsOptional()
  id!: number;
}
