import { NextApiRequest, NextApiResponse } from "next";

import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { MasterDataService } from "./masterData.service";
import { CreateMasterDataDto } from "./dtos/create-masterData.dto";
import { UpdateMasterDataDto } from "./dtos/update-masterData.dto";
import { AuditLogsService } from "../auditLogs/auditLogs.service";
import { CreateAuditLogsDto } from "../auditLogs/dtos/create_auditLog.dto";

const ENTITY = "MASTER_DATA";
export class MasterDataController {
  private readonly masterDataService: MasterDataService;

  private readonly auditLogService: AuditLogsService;

  constructor() {
    this.masterDataService = new MasterDataService();
    this.auditLogService = new AuditLogsService();
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

      res.status(200).json(masterData);
    } catch (error) {
      MasterDataController.handleError(error, res);
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateMasterDataDto, req.body);

      const newMasterData = await this.masterDataService.create(createDto);

      const createAuditLogDto = await validateDto(CreateAuditLogsDto, {
        entity: ENTITY,
        entityId: newMasterData.id,
        newValue: newMasterData,
        oldValue: {},
        requestType: "CREATE",
        requestedBy: 1,
      });

      await this.auditLogService.create(createAuditLogDto);

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

      const createAuditLogDto = await validateDto(CreateAuditLogsDto, {
        entity: ENTITY,
        entityId: updateDto.id,
        newValue: newMasterData.masterData,
        oldValue: newMasterData.oldValue,
        requestType: "UPDATE",
        requestedBy: 1,
      });

      await this.auditLogService.create(createAuditLogDto);

      res.status(200).json(newMasterData);
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
