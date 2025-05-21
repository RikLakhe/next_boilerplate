import { IsNotEmpty, IsOptional, IsInt, IsNumber } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;
}
