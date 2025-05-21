import { NextApiRequest, NextApiResponse } from "next";

import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { validateDto } from "@/server/common/utils/validation.util";
import { AuditLogsService } from "../auditLogs/auditLogs.service";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dtos/create-events.dto";
import { CreateAuditLogsDto } from "../auditLogs/dtos/create_auditLog.dto";
import { UpdateEventDto } from "./dtos/update-events.dto";

const ENTITY = "EVENTS";

export class EventsController {
  private readonly eventsService: EventsService;

  private readonly auditLogService: AuditLogsService;

  constructor() {
    this.eventsService = new EventsService();
    this.auditLogService = new AuditLogsService();
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const eventsData = await this.eventsService.findAll();
      res.status(200).json(eventsData);
    } catch (error) {
      EventsController.handleError(error, res);
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateEventDto, req.body);

      const newEventData = await this.eventsService.create(createDto);

      const createAuditLogDto = await validateDto(CreateAuditLogsDto, {
        entity: ENTITY,
        entityId: newEventData.id,
        newValue: newEventData,
        oldValue: {},
        requestType: "CREATE",
        requestedBy: 1,
      });

      await this.auditLogService.create(createAuditLogDto);

      res.status(201).json(newEventData);
    } catch (error) {
      EventsController.handleError(error, res);
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const updateDto = await validateDto(UpdateEventDto, req.body);

      const newEventData = await this.eventsService.update(
        updateDto.id,
        updateDto,
      );

      const createAuditLogDto = await validateDto(CreateAuditLogsDto, {
        entity: ENTITY,
        entityId: updateDto.id,
        newValue: newEventData.event,
        oldValue: newEventData.oldValue,
        requestType: "UPDATE",
        requestedBy: 1,
      });

      await this.auditLogService.create(createAuditLogDto);

      res.status(201).json(newEventData.event);
    } catch (error) {
      EventsController.handleError(error, res);
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
