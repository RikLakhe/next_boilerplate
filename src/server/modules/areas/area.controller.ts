import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { AreasService } from "./area.service";
import { CreateAreaDto } from "./dtos/create-area.dto";

export class AreasController {
  private readonly areasService: AreasService;

  constructor() {
    this.areasService = new AreasService();
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateAreaDto, req.body);
      const newArea = await this.areasService.create(createDto);
      res.status(201).json(newArea);
    } catch (error) {
      AreasController.handleError(error, res);
    }
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const areas = await this.areasService.findAll();
      res.status(200).json(areas);
    } catch (error) {
      AreasController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const areas = await this.areasService.findAll();
      const dropdownList = areas.map((area) => {
        return {
          code: area.id,
          title: area.name,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      AreasController.handleError(error, res);
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
