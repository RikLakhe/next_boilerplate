import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from "class-validator";

export class UpdateMasterDataDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  code?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  entity_type?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
