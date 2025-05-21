import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateEventDto } from "./create-events.dto";

export class UpdateEventDto extends CreateEventDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;
}
