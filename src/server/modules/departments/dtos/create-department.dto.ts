import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsNumber,
} from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  departmentName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNumber()
  @IsOptional()
  departmentManagerId?: number;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
