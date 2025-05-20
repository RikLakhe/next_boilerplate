import { fiscal_years as FiscalYear, Prisma } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateFiscalYearDto } from "./dtos/create-fiscalYear.dto";
import { UpdateFiscalYearDto } from "./dtos/update-fiscalYear.dto";

export class FiscalYearService {
  constructor(private readonly prismaClient = prisma) {}

  async findAll(): Promise<FiscalYear[]> {
    try {
      return await this.prismaClient.fiscal_years.findMany({
        orderBy: { start_date: "desc" },
      });
    } catch (error) {
      logger.error("Error finding all fiscal years:", error);
      throw new HttpException(500, "Failed to retrieve fiscal years.");
    }
  }

  async findOne(id: number): Promise<FiscalYear | null> {
    try {
      const fiscalYear = await this.prismaClient.fiscal_years.findUnique({
        where: { id },
      });
      if (!fiscalYear) {
        logger.warn(`Not Found: Fiscal year with ID ${id} not found.`);
        throw new HttpException(404, `Fiscal year with ID ${id} not found.`);
      }
      return fiscalYear;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error finding fiscal year with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve fiscal year with ID ${id}.`,
      );
    }
  }

  async create(createFiscalYearDto: CreateFiscalYearDto): Promise<FiscalYear> {
    try {
      const newFiscalYear = await this.prismaClient.fiscal_years.create({
        data: {
          name: createFiscalYearDto.name,
          start_date: createFiscalYearDto.startDate,
          end_date: createFiscalYearDto.endDate,
          description: createFiscalYearDto.description,
          is_active: createFiscalYearDto.isActive ?? true,
        },
      });

      return newFiscalYear;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Fiscal year with name '${createFiscalYearDto.name}' already exists.`,
          );
          throw new HttpException(
            409,
            `Fiscal year with name '${createFiscalYearDto.name}' already exists.`,
          );
        }
      }
      logger.error("Error creating fiscal year:", error);
      throw new HttpException(500, "Failed to create fiscal year.");
    }
  }

  async update(
    id: number,
    updateFiscalYearDto: UpdateFiscalYearDto,
  ): Promise<FiscalYear> {
    try {
      await this.findOne(id);

      return await this.prismaClient.fiscal_years.update({
        where: { id },
        data: {
          name: updateFiscalYearDto.name,
          start_date: updateFiscalYearDto.startDate,
          end_date: updateFiscalYearDto.endDate,
          description: updateFiscalYearDto.description,
          is_active: updateFiscalYearDto.isActive,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Fiscal year name '${updateFiscalYearDto.name}' might already be in use.`,
          );
          throw new HttpException(
            409,
            `Fiscal year name '${updateFiscalYearDto.name}' might already be in use.`,
          );
        }
        if (error.code === "P2025") {
          logger.warn(
            `Not Found: Fiscal year with ID ${id} not found for update.`,
          );
          throw new HttpException(
            404,
            `Fiscal year with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating fiscal year with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update fiscal year with ID ${id}.`,
      );
    }
  }
}
