import {
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  IsNotEmpty,
} from "class-validator";
import { CreateDesignationDto } from "./create-designation.dto";

export class UpdateDesignationDto extends CreateDesignationDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;

  @IsDateString()
  @IsOptional()
  updatedOn?: string;
}
