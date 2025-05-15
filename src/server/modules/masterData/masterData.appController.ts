import { master_data as MasterData } from "@prisma/client";

import { MasterDataProps } from "@/types/masterData";
import { MasterDataService } from "./masterData.service";

export class MasterDataAppController {
  private readonly masterDataService: MasterDataService;

  constructor() {
    this.masterDataService = new MasterDataService();
  }

  async findAll(): Promise<MasterData[]> {
    return this.masterDataService.findAll();
  }

  async list(): Promise<MasterDataProps[]> {
    const masterData = await this.masterDataService.findAll();
    return masterData.map((data) => {
      return {
        id: data.id,
        code: data.code,
        label: data.label,
        entity_type: data.entity_type,
        color: data.color,
        is_active: data.is_active,
      };
    });
  }

  async listByEntity(entity?: string): Promise<MasterDataProps[]> {
    const masterData = await this.masterDataService.findAll(entity);
    return masterData.map((data) => {
      return {
        id: data.id,
        code: data.code,
        label: data.label,
        entity_type: data.entity_type,
        color: data.color,
        is_active: data.is_active,
      };
    });
  }
}
