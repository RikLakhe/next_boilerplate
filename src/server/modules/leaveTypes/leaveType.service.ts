import { leave_types, Prisma } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateLeaveTypeDto } from "./dtos/create-leaveType.dto";
import { UpdateLeaveTypeDto } from "./dtos/update-leaveType.dto";

export class LeaveTypeService {
  constructor(private readonly prismaClient = prisma) {}

  async findAll(): Promise<leave_types[]> {
    try {
      return await this.prismaClient.leave_types.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      logger.error("Error finding all leave types:", error);
      throw new HttpException(500, "Failed to retrieve leave types.");
    }
  }

  async findOne(id: number): Promise<leave_types | null> {
    try {
      const leaveType = await this.prismaClient.leave_types.findUnique({
        where: { id },
      });
      if (!leaveType) {
        logger.warn(`Not Found: Leave type with ID ${id} not found.`);
        throw new HttpException(404, `Leave type with ID ${id} not found.`);
      }
      return leaveType;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error finding leave type with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve leave type with ID ${id}.`,
      );
    }
  }

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<leave_types> {
    try {
      // Check if leave type with same name or code already exists
      const existingLeaveType = await this.prismaClient.leave_types.findFirst({
        where: {
          OR: [
            { name: createLeaveTypeDto.name },
            { code: createLeaveTypeDto.code },
          ],
        },
      });

      if (existingLeaveType) {
        throw new HttpException(
          409,
          "Leave type with this name or code already exists.",
        );
      }

      const newLeaveType = await this.prismaClient.leave_types.create({
        data: {
          name: createLeaveTypeDto.name,
          code: createLeaveTypeDto.code,
          description: createLeaveTypeDto.description,
          days: createLeaveTypeDto.days,
          carry_over_days: createLeaveTypeDto.carryOverDays ?? 0,
          is_active: createLeaveTypeDto.isActive ?? false,
          created_by: createLeaveTypeDto.createdBy,
        },
      });

      return newLeaveType;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error("Error creating leave type:", error);
      throw new HttpException(500, "Failed to create leave type.");
    }
  }

  async update(
    id: number,
    updateLeaveTypeDto: UpdateLeaveTypeDto,
  ): Promise<leave_types> {
    try {
      await this.findOne(id);

      // Check if updating would create a duplicate
      const existingLeaveType = await this.prismaClient.leave_types.findFirst({
        where: {
          OR: [
            { name: updateLeaveTypeDto.name },
            { code: updateLeaveTypeDto.code },
          ],
          id: { not: id }, // Exclude current record
        },
      });

      if (existingLeaveType) {
        throw new HttpException(
          409,
          "Leave type with this name or code already exists.",
        );
      }

      return await this.prismaClient.leave_types.update({
        where: { id },
        data: {
          name: updateLeaveTypeDto.name,
          code: updateLeaveTypeDto.code,
          description: updateLeaveTypeDto.description,
          days: updateLeaveTypeDto.days,
          carry_over_days: updateLeaveTypeDto.carryOverDays,
          is_active: updateLeaveTypeDto.isActive,
          updated_by: updateLeaveTypeDto.updatedBy,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error updating leave type with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update leave type with ID ${id}.`,
      );
    }
  }
}
