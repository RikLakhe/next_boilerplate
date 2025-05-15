import { NextApiRequest, NextApiResponse } from "next";

import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { MasterDataService } from "./masterData.service";
import { CreateMasterDataDto } from "./dtos/create-masterData.dto";
import { UpdateMasterDataDto } from "./dtos/update-masterData.dto";

export class MasterDataController {
  private readonly masterDataService: MasterDataService;

  constructor() {
    this.masterDataService = new MasterDataService();
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const masterData = await this.masterDataService.findAll();
      res.status(200).json(masterData);
    } catch (error) {
      MasterDataController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const masterData = await this.masterDataService.findAll();
      const dropdownList = masterData.map((data) => {
        return {
          code: data.id,
          label: data.label,
          entity_type: data.entity_type,
          color: data.color,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      MasterDataController.handleError(error, res);
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateMasterDataDto, req.body);

      const newMasterData = await this.masterDataService.create(createDto);
      res.status(201).json(newMasterData);
    } catch (error) {
      MasterDataController.handleError(error, res);
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const updateDto = await validateDto(UpdateMasterDataDto, req.body);

      const newMasterData = await this.masterDataService.update(
        updateDto.id,
        updateDto,
      );
      res.status(201).json(newMasterData);
    } catch (error) {
      MasterDataController.handleError(error, res);
    }
  }

  private static handleError(error: unknown, res: NextApiResponse) {
    if (error instanceof HttpException) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      logger.error("Unhandled API error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
