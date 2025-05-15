import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";

export class CreateMasterDataDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @IsString()
  @IsOptional()
  label!: string;

  @IsString()
  @IsOptional()
  entity_type!: string;

  @IsString()
  @IsOptional()
  color?: string;
}
