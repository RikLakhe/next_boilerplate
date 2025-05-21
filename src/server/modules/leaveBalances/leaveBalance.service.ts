import { leave_balances, Prisma } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateLeaveBalanceDto } from "./dtos/create-leaveBalance.dto";
import { UpdateLeaveBalanceDto } from "./dtos/update-leaveBalance.dto";

export class LeaveBalanceService {
  constructor(private readonly prismaClient = prisma) {}

  async findAll(): Promise<leave_balances[]> {
    try {
      return await this.prismaClient.leaveBalance.findMany({
        include: {
          user: true,
          leave_types: true,
          fiscal_years: true,
        },
        orderBy: [
          { user: { fullName: "asc" } },
          { fiscal_years: { start_date: "desc" } },
        ],
      });
    } catch (error) {
      logger.error("Error finding all leave balances:", error);
      throw new HttpException(500, "Failed to retrieve leave balances.");
    }
  }

  async findByUserId(userId: number): Promise<leave_balances[]> {
    try {
      return await this.prismaClient.leave_balances.findMany({
        where: { user_id: userId },
        include: {
          leave_types: true,
          fiscal_years: true,
        },
        orderBy: { fiscal_years: { start_date: "desc" } },
      });
    } catch (error) {
      logger.error(`Error finding leave balances for user ${userId}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve leave balances for user ${userId}.`,
      );
    }
  }

  async findOne(id: number): Promise<leave_balances | null> {
    try {
      const leaveBalance = await this.prismaClient.leave_balances.findUnique({
        where: { id },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
        },
      });
      if (!leaveBalance) {
        logger.warn(`Not Found: Leave balance with ID ${id} not found.`);
        throw new HttpException(404, `Leave balance with ID ${id} not found.`);
      }
      return leaveBalance;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error finding leave balance with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve leave balance with ID ${id}.`,
      );
    }
  }

  async create(
    createLeaveBalanceDto: CreateLeaveBalanceDto,
  ): Promise<leave_balances> {
    try {
      // Check if balance already exists for this combination
      const existingBalance = await this.prismaClient.leave_balances.findFirst({
        where: {
          user_id: createLeaveBalanceDto.userId,
          leave_type_id: createLeaveBalanceDto.leaveTypeId,
          fiscal_year_id: createLeaveBalanceDto.fiscalYearId,
        },
      });

      if (existingBalance) {
        throw new HttpException(
          409,
          "Leave balance already exists for this user, leave type, and fiscal year combination.",
        );
      }

      const newLeaveBalance = await this.prismaClient.leave_balances.create({
        data: {
          user_id: createLeaveBalanceDto.userId,
          leave_type_id: createLeaveBalanceDto.leaveTypeId,
          fiscal_year_id: createLeaveBalanceDto.fiscalYearId,
          total_days: createLeaveBalanceDto.totalDays,
          used_days: createLeaveBalanceDto.usedDays ?? 0,
          is_active: createLeaveBalanceDto.isActive ?? false,
        },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
        },
      });

      return newLeaveBalance;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error("Error creating leave balance:", error);
      throw new HttpException(500, "Failed to create leave balance.");
    }
  }

  async update(
    id: number,
    updateLeaveBalanceDto: UpdateLeaveBalanceDto,
  ): Promise<leave_balances> {
    try {
      await this.findOne(id);

      // Check if updating would create a duplicate
      const existingBalance = await this.prismaClient.leave_balances.findFirst({
        where: {
          user_id: updateLeaveBalanceDto.userId,
          leave_type_id: updateLeaveBalanceDto.leaveTypeId,
          fiscal_year_id: updateLeaveBalanceDto.fiscalYearId,
          id: { not: id }, // Exclude current record
        },
      });

      if (existingBalance) {
        throw new HttpException(
          409,
          "Leave balance already exists for this user, leave type, and fiscal year combination.",
        );
      }

      return await this.prismaClient.leave_balances.update({
        where: { id },
        data: {
          user_id: updateLeaveBalanceDto.userId,
          leave_type_id: updateLeaveBalanceDto.leaveTypeId,
          fiscal_year_id: updateLeaveBalanceDto.fiscalYearId,
          total_days: updateLeaveBalanceDto.totalDays,
          used_days: updateLeaveBalanceDto.usedDays,
          is_active: updateLeaveBalanceDto.isActive,
        },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error updating leave balance with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update leave balance with ID ${id}.`,
      );
    }
  }

  async updateUsedDays(id: number, usedDays: number): Promise<leave_balances> {
    try {
      const leaveBalance = await this.findOne(id);

      if (usedDays > Number(leaveBalance.total_days)) {
        throw new HttpException(
          400,
          "Used days cannot exceed total days allocated.",
        );
      }

      return await this.prismaClient.leave_balances.update({
        where: { id },
        data: { used_days: usedDays },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error updating used days for leave balance ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update used days for leave balance ${id}.`,
      );
    }
  }

  async getAvailableDays(id: number): Promise<number> {
    try {
      const leaveBalance = await this.findOne(id);
      return Number(leaveBalance.total_days) - Number(leaveBalance.used_days);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(
        `Error calculating available days for leave balance ${id}:`,
        error,
      );
      throw new HttpException(
        500,
        `Failed to calculate available days for leave balance ${id}.`,
      );
    }
  }
}
