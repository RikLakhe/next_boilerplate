import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { LeaveTypeService } from "./leaveType.service";
import { CreateLeaveTypeDto } from "./dtos/create-leaveType.dto";
import { UpdateLeaveTypeDto } from "./dtos/update-leaveType.dto";

export class LeaveTypeController {
  private readonly leaveTypeService: LeaveTypeService;

  constructor() {
    this.leaveTypeService = new LeaveTypeService();
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const leaveTypes = await this.leaveTypeService.findAll();
      res.status(200).json(leaveTypes);
    } catch (error) {
      LeaveTypeController.handleError(error, res);
    }
  }

  async findOne(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) {
        throw new HttpException(400, "Invalid ID parameter");
      }

      const leaveType = await this.leaveTypeService.findOne(id);
      res.status(200).json(leaveType);
    } catch (error) {
      LeaveTypeController.handleError(error, res);
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateLeaveTypeDto, req.body);
      const newLeaveType = await this.leaveTypeService.create(createDto);
      res.status(201).json(newLeaveType);
    } catch (error) {
      LeaveTypeController.handleError(error, res);
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const updateDto = await validateDto(UpdateLeaveTypeDto, req.body);
      const updatedLeaveType = await this.leaveTypeService.update(
        updateDto.id,
        updateDto,
      );
      res.status(200).json(updatedLeaveType);
    } catch (error) {
      LeaveTypeController.handleError(error, res);
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
