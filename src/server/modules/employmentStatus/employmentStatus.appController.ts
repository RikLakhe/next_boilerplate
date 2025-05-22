import { EmploymentStatus } from "@prisma/client";

import { EmploymentStatusService } from "./employmentStatus.service";

export class EmploymentStatusAppController {
  private readonly employmentStatusService: EmploymentStatusService;

  constructor() {
    this.employmentStatusService = new EmploymentStatusService();
  }

  async list(): Promise<EmploymentStatus[]> {
    return this.employmentStatusService.findAll();
  }
}
