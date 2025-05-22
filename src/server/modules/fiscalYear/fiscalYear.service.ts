import { FiscalYear } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateFiscalYearDto } from "./dtos/create-fiscalYear.dto";
import { UpdateFiscalYearDto } from "./dtos/update-fiscalYear.dto";

export class FiscalYearService {
  constructor(private readonly prismaClient = prisma) {}

  private async validateFiscalYearDates(
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ): Promise<void> {
    // Check if start date is before end date
    if (startDate >= endDate) {
      throw new HttpException(400, "Start date must be before end date");
    }

    // Check for overlapping fiscal years
    const overlappingFiscalYear = await this.prismaClient.fiscalYear.findFirst({
      where: {
        AND: [
          {
            OR: [
              // New fiscal year starts during an existing one
              {
                startDate: { lte: startDate },
                endDate: { gte: startDate },
              },
              // New fiscal year ends during an existing one
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
              // New fiscal year completely contains an existing one
              {
                startDate: { gte: startDate },
                endDate: { lte: endDate },
              },
            ],
          },
          // Exclude current fiscal year when updating
          ...(excludeId ? [{ id: { not: excludeId } }] : []),
        ],
      },
    });

    if (overlappingFiscalYear) {
      throw new HttpException(
        400,
        `Fiscal year dates overlap with existing fiscal year: ${overlappingFiscalYear.name}`,
      );
    }
  }

  async findAll(): Promise<FiscalYear[]> {
    try {
      return await this.prismaClient.fiscalYear.findMany();
    } catch (error) {
      logger.error("Error fetching fiscal years:", error);
      throw new HttpException(500, "Failed to fetch fiscal years");
    }
  }

  async findOne(id: number): Promise<FiscalYear> {
    try {
      const fiscalYear = await this.prismaClient.fiscalYear.findUnique({
        where: { id },
      });

      if (!fiscalYear) {
        throw new HttpException(404, "Fiscal year not found");
      }

      return fiscalYear;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error fetching fiscal year with ID ${id}:`, error);
      throw new HttpException(500, "Failed to fetch fiscal year");
    }
  }

  async create(createFiscalYearDto: CreateFiscalYearDto): Promise<FiscalYear> {
    try {
      await this.validateFiscalYearDates(
        createFiscalYearDto.startDate,
        createFiscalYearDto.endDate,
      );

      return await this.prismaClient.fiscalYear.create({
        data: createFiscalYearDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error("Error creating fiscal year:", error);
      throw new HttpException(500, "Failed to create fiscal year");
    }
  }

  async update(
    id: number,
    updateFiscalYearDto: UpdateFiscalYearDto,
  ): Promise<FiscalYear> {
    try {
      await this.validateFiscalYearDates(
        updateFiscalYearDto.startDate,
        updateFiscalYearDto.endDate,
        id,
      );

      return await this.prismaClient.fiscalYear.update({
        where: { id },
        data: updateFiscalYearDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error updating fiscal year with ID ${id}:`, error);
      throw new HttpException(500, "Failed to update fiscal year");
    }
  }

  async remove(id: number): Promise<FiscalYear> {
    try {
      await this.findOne(id);

      return await this.prismaClient.fiscalYear.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error deleting fiscal year with ID ${id}:`, error);
      throw new HttpException(500, "Failed to delete fiscal year");
    }
  }
}
