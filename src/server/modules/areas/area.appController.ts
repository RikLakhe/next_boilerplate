import { Area } from "@prisma/client";

import { AreasService } from "./area.service";

export class AreaAppController {
  private readonly areaService: AreasService;

  constructor() {
    this.areaService = new AreasService();
  }

  async list(): Promise<Area[]> {
    return this.areaService.findAll();
  }
}
