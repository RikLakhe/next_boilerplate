import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { FiscalYearService } from "./fiscalYear.service";
import { CreateFiscalYearDto } from "./dtos/create-fiscalYear.dto";
import { UpdateFiscalYearDto } from "./dtos/update-fiscalYear.dto";

export class FiscalYearController {
  private readonly fiscalYearService: FiscalYearService;

  constructor() {
    this.fiscalYearService = new FiscalYearService();
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const fiscalYears = await this.fiscalYearService.findAll();
      res.status(200).json(fiscalYears);
    } catch (error) {
      FiscalYearController.handleError(error, res);
    }
  }

  async findOne(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = parseInt(req.query.id as string, 10);
      if (Number.isNaN(id)) {
        throw new HttpException(400, "Invalid ID parameter");
      }

      const fiscalYear = await this.fiscalYearService.findOne(id);
      res.status(200).json(fiscalYear);
    } catch (error) {
      FiscalYearController.handleError(error, res);
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateFiscalYearDto, req.body);
      const newFiscalYear = await this.fiscalYearService.create(createDto);
      res.status(201).json(newFiscalYear);
    } catch (error) {
      FiscalYearController.handleError(error, res);
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const updateDto = await validateDto(UpdateFiscalYearDto, req.body);
      const updatedFiscalYear = await this.fiscalYearService.update(
        updateDto.id,
        updateDto,
      );
      res.status(200).json(updatedFiscalYear);
    } catch (error) {
      FiscalYearController.handleError(error, res);
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
