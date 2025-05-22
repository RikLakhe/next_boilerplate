import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsString,
  IsEmail,
  MaxLength,
} from "class-validator";

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullName?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  managerId?: number;

  @IsInt()
  @IsOptional()
  currentAreaId?: number;

  @IsInt()
  @IsOptional()
  currentDesignationId?: number;

  @IsInt()
  @IsOptional()
  currentEmploymentStatusId?: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;
}
