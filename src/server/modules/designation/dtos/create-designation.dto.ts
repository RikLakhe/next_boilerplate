import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsInt,
  IsDateString,
} from "class-validator";

export class CreateDesignationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  createdBy?: number;

  @IsDateString()
  @IsOptional()
  createdOn?: string;

  @IsInt()
  @IsOptional()
  updatedBy?: number;

  @IsDateString()
  @IsOptional()
  updatedOn?: string;
}
