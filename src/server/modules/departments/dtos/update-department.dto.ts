import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsNotEmpty,
} from "class-validator";

export class UpdateDepartmentDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  departmentName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNumber()
  @IsOptional()
  departmentManagerId?: number;
}
