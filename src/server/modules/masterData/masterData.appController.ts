import { MasterData } from "@prisma/client";

import { MasterDataService } from "./masterData.service";

export class MasterDataAppController {
  private readonly masterDataService: MasterDataService;

  constructor() {
    this.masterDataService = new MasterDataService();
  }

  async findAll(): Promise<MasterData[]> {
    return this.masterDataService.findAll();
  }

  async list(): Promise<MasterData[]> {
    return this.masterDataService.findAll();
  }

  async listByEntity(entity?: string): Promise<MasterData[]> {
    return this.masterDataService.findAll(entity);
  }
}
