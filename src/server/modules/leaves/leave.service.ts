import { leaves, leave_transactions, Prisma } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateLeaveDto } from "./dtos/create-leave.dto";
import { UpdateLeaveDto } from "./dtos/update-leave.dto";
import { CreateLeaveTransactionDto } from "./dtos/create-leave-transaction.dto";

export class LeaveService {
  constructor(private readonly prismaClient = prisma) {}

  private validateLeaveDates(
    startDate: Date,
    endDate: Date,
    durationDays: number,
  ): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // Check if dates are in the future
    if (start < today) {
      throw new HttpException(400, "Leave start date must be in the future.");
    }

    // Check if end date is after start date
    if (end < start) {
      throw new HttpException(400, "Leave end date must be after start date.");
    }

    // For leaves more than 2 days, check if requested at least 2 days in advance
    if (durationDays > 2) {
      const daysUntilStart = Math.floor(
        (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilStart < 2) {
        throw new HttpException(
          400,
          "Leaves of more than 2 days must be requested at least 2 days in advance.",
        );
      }
    }
  }

  async findAll(): Promise<leaves[]> {
    try {
      return await this.prismaClient.leaves.findMany({
        orderBy: { applied_at: "desc" },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
          users_leaves_approved_byTousers: true,
          users_leaves_manager_idTousers: true,
          leave_transactions: {
            orderBy: { created_at: "desc" },
          },
        },
      });
    } catch (error) {
      logger.error("Error finding all leaves:", error);
      throw new HttpException(500, "Failed to retrieve leaves.");
    }
  }

  async findOne(id: number): Promise<leaves | null> {
    try {
      const leave = await this.prismaClient.leaves.findUnique({
        where: { id },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
          users_leaves_approved_byTousers: true,
          users_leaves_manager_idTousers: true,
          leave_transactions: {
            orderBy: { created_at: "desc" },
          },
        },
      });
      if (!leave) {
        logger.warn(`Not Found: Leave with ID ${id} not found.`);
        throw new HttpException(404, `Leave with ID ${id} not found.`);
      }
      return leave;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error finding leave with ID ${id}:`, error);
      throw new HttpException(500, `Failed to retrieve leave with ID ${id}.`);
    }
  }

  private async createTransaction(
    createTransactionDto: CreateLeaveTransactionDto,
  ): Promise<leave_transactions> {
    return await this.prismaClient.leave_transactions.create({
      data: {
        leave_id: createTransactionDto.leaveId,
        type: createTransactionDto.type,
        notes: createTransactionDto.notes,
      },
    });
  }

  async create(createLeaveDto: CreateLeaveDto): Promise<leaves> {
    try {
      // Validate leave dates
      this.validateLeaveDates(
        createLeaveDto.startDate,
        createLeaveDto.endDate,
        createLeaveDto.durationDays,
      );

      // Check if user has sufficient leave balance
      const leaveBalance = await this.prismaClient.leave_balances.findFirst({
        where: {
          user_id: createLeaveDto.userId,
          leave_type_id: createLeaveDto.leaveTypeId,
          fiscal_year_id: createLeaveDto.fiscalYearId,
          is_active: true,
        },
      });

      if (!leaveBalance) {
        throw new HttpException(
          400,
          "No active leave balance found for the specified leave type and fiscal year.",
        );
      }

      const remainingDays =
        Number(leaveBalance.total_days) - Number(leaveBalance.used_days);
      if (remainingDays < createLeaveDto.durationDays) {
        throw new HttpException(
          400,
          "Insufficient leave balance for the requested duration.",
        );
      }

      // Create leave and transaction in a transaction
      const [newLeave] = await this.prismaClient.$transaction([
        this.prismaClient.leaves.create({
          data: {
            user_id: createLeaveDto.userId,
            leave_type_id: createLeaveDto.leaveTypeId,
            fiscal_year_id: createLeaveDto.fiscalYearId,
            start_date: createLeaveDto.startDate,
            end_date: createLeaveDto.endDate,
            duration_days: createLeaveDto.durationDays,
            reason: createLeaveDto.reason,
            status: createLeaveDto.status ?? "pending",
            manager_id: createLeaveDto.managerId,
            created_by: createLeaveDto.createdBy,
          },
        }),
        this.createTransaction({
          leaveId: 0, // Will be updated after leave creation
          type: "request",
          notes: "Leave request created",
        }),
      ]);

      // Update the transaction with the correct leave ID
      await this.createTransaction({
        leaveId: newLeave.id,
        type: "request",
        notes: "Leave request created",
      });

      return await this.findOne(newLeave.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error("Error creating leave:", error);
      throw new HttpException(500, "Failed to create leave.");
    }
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto): Promise<leaves> {
    try {
      const existingLeave = await this.findOne(id);

      // Only validate dates if they are being updated
      if (
        updateLeaveDto.startDate ||
        updateLeaveDto.endDate ||
        updateLeaveDto.durationDays
      ) {
        this.validateLeaveDates(
          updateLeaveDto.startDate ?? existingLeave.start_date,
          updateLeaveDto.endDate ?? existingLeave.end_date,
          updateLeaveDto.durationDays ?? Number(existingLeave.duration_days),
        );
      }

      // If status is being updated to approved/rejected, update approved_by and approved_at
      const updateData: Prisma.leavesUpdateInput = {
        user_id: updateLeaveDto.userId,
        leave_type_id: updateLeaveDto.leaveTypeId,
        fiscal_year_id: updateLeaveDto.fiscalYearId,
        start_date: updateLeaveDto.startDate,
        end_date: updateLeaveDto.endDate,
        duration_days: updateLeaveDto.durationDays,
        reason: updateLeaveDto.reason,
        status: updateLeaveDto.status,
        manager_id: updateLeaveDto.managerId,
        updated_by: updateLeaveDto.updatedBy,
      };

      let transactionType:
        | "approval"
        | "rejection"
        | "cancellation"
        | undefined;
      let transactionNotes = updateLeaveDto.notes;

      if (
        updateLeaveDto.status === "approved" ||
        updateLeaveDto.status === "rejected"
      ) {
        updateData.approved_by = updateLeaveDto.approvedBy;
        updateData.approved_at = new Date();
        transactionType =
          updateLeaveDto.status === "approved" ? "approval" : "rejection";
        transactionNotes =
          transactionNotes ||
          `${updateLeaveDto.status} by ${updateLeaveDto.approvedBy}`;
      } else if (updateLeaveDto.status === "cancelled") {
        transactionType = "cancellation";
        transactionNotes = transactionNotes || "Leave request cancelled";
      }

      // If status is being updated to approved, update leave balance
      if (
        updateLeaveDto.status === "approved" &&
        existingLeave.status !== "approved"
      ) {
        await this.prismaClient.leave_balances.update({
          where: {
            user_id_leave_type_id_fiscal_year_id: {
              user_id: existingLeave.user_id,
              leave_type_id: existingLeave.leave_type_id,
              fiscal_year_id: existingLeave.fiscal_year_id,
            },
          },
          data: {
            used_days: {
              increment: existingLeave.duration_days,
            },
          },
        });
      }

      // Update leave and create transaction in a transaction
      const [updatedLeave] = await this.prismaClient.$transaction([
        this.prismaClient.leaves.update({
          where: { id },
          data: updateData,
        }),
        transactionType
          ? this.createTransaction({
              leaveId: id,
              type: transactionType,
              notes: transactionNotes,
            })
          : Promise.resolve(),
      ]);

      return await this.findOne(updatedLeave.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error updating leave with ID ${id}:`, error);
      throw new HttpException(500, `Failed to update leave with ID ${id}.`);
    }
  }

  async findByManagerId(managerId: number): Promise<leaves[]> {
    try {
      return await this.prismaClient.leaves.findMany({
        where: {
          manager_id: managerId,
        },
        orderBy: { applied_at: "desc" },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
          users_leaves_approved_byTousers: true,
          users_leaves_manager_idTousers: true,
          leave_transactions: {
            orderBy: { created_at: "desc" },
          },
        },
      });
    } catch (error) {
      logger.error(`Error finding leaves for manager ${managerId}:`, error);
      throw new HttpException(500, "Failed to retrieve leaves.");
    }
  }

  async findByUserId(userId: number): Promise<leaves[]> {
    try {
      return await this.prismaClient.leaves.findMany({
        where: {
          user_id: userId,
        },
        orderBy: { applied_at: "desc" },
        include: {
          users: true,
          leave_types: true,
          fiscal_years: true,
          users_leaves_approved_byTousers: true,
          users_leaves_manager_idTousers: true,
          leave_transactions: {
            orderBy: { created_at: "desc" },
          },
        },
      });
    } catch (error) {
      logger.error(`Error finding leaves for user ${userId}:`, error);
      throw new HttpException(500, "Failed to retrieve leaves.");
    }
  }
}
