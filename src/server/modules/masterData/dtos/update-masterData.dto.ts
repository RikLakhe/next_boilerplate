import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateMasterDataDto } from "./create-masterData.dto";

export class UpdateMasterDataDto extends CreateMasterDataDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;
}
