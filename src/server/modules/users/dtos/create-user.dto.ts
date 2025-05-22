import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
  IsEmail,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

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
  @IsNotEmpty()
  currentEmploymentStatusId!: number;

  @IsInt()
  @IsOptional()
  createdBy?: number;
}
