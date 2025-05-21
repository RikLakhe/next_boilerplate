import { FiscalYear } from "@prisma/client";
import { FiscalYearService } from "./fiscalYear.service";

export class FiscalYearAppController {
  private readonly fiscalYearService: FiscalYearService;

  constructor() {
    this.fiscalYearService = new FiscalYearService();
  }

  async list(): Promise<FiscalYear[]> {
    return this.fiscalYearService.findAll();
  }
}
