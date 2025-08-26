import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateDesignationDto } from "./dtos/create-designation.dto";
import { DesignationService } from "./designation.service";

export class DesignationController {
  private readonly designationService: DesignationService;

  constructor() {
    this.designationService = new DesignationService();
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateDesignationDto, req.body);
      const newDesignation = await this.designationService.create(createDto);
      res.status(201).json(newDesignation);
    } catch (error) {
      DesignationController.handleError(error, res);
    }
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const designations = await this.designationService.findAll();
      res.status(200).json(designations);
    } catch (error) {
      DesignationController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const designations = await this.designationService.findAll();
      const dropdownList = designations.map((designation) => {
        return {
          code: designation.id,
          title: designation.title,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      DesignationController.handleError(error, res);
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
