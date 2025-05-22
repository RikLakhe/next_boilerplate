import { Designation } from "@prisma/client";

import { DesignationService } from "./designation.service";

export class DesignationAppController {
  private readonly designationService: DesignationService;

  constructor() {
    this.designationService = new DesignationService();
  }

  async list(): Promise<Designation[]> {
    return this.designationService.findAll();
  }
}
