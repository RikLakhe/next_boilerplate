import { IsNumber } from "class-validator";
import { CreateFiscalYearDto } from "./create-fiscalYear.dto";

export class UpdateFiscalYearDto extends CreateFiscalYearDto {
  @IsNumber()
  id: number;
}
