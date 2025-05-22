import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { UsersService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AuditLogsService } from "../auditLogs/auditLogs.service";
import { CreateAuditLogsDto } from "../auditLogs/dtos/create_auditLog.dto";

const ENTITY = "USERS";

export class UserController {
  private readonly usersService: UsersService;

  private readonly auditLogService: AuditLogsService;

  constructor() {
    this.usersService = new UsersService();
    this.auditLogService = new AuditLogsService();
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const formData = {
        full_name: req.body.fullName,
        email: req.body.email,
        password_hash: req.body.password,
        current_employment_status_id: 1,
      };
      const createDto = await validateDto(CreateUserDto, formData);
      const newUser = await this.usersService.create(createDto);

      const createAuditLogDto = await validateDto(CreateAuditLogsDto, {
        entity: ENTITY,
        entityId: newUser.id,
        newValue: newUser,
        oldValue: {},
        requestType: "CREATE",
        requestedBy: 1,
      });

      await this.auditLogService.create(createAuditLogDto);

      res.status(201).json(newUser);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const users = await this.usersService.findAll();
      res.status(200).json(users);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const users = await this.usersService.findAll();
      const dropdownList = users.map((user) => {
        return {
          code: user.id,
          title: user.fullName,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const formData = {
        id: req.body.id,
        full_name: req.body.fullName,
        email: req.body.email,
        password_hash: req.body.password,
        current_employment_status_id: 1,
      };
      const updateDto = await validateDto(UpdateUserDto, formData);

      const userData = await this.usersService.update(updateDto.id, updateDto);
      const createAuditLogDto = await validateDto(CreateAuditLogsDto, {
        entity: ENTITY,
        entity_id: updateDto.id,
        newValue: userData.newValue,
        oldValue: userData.oldValue,
        request_type: "UPDATE",
        requested_by: 1,
      });

      await this.auditLogService.create(createAuditLogDto);

      res.status(200).json(userData);
    } catch (error) {
      UserController.handleError(error, res);
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
