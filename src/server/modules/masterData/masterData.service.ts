import { MasterData, Prisma } from "@prisma/client";

import { prisma } from "@/server/common/prisma/client"; // Import the singleton instance
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateMasterDataDto } from "./dtos/create-masterData.dto";
import { UpdateMasterDataDto } from "./dtos/update-masterData.dto";

export class MasterDataService {
  constructor(private readonly prismaClient = prisma) {}

  async findAll(entityType?: string): Promise<MasterData[]> {
    try {
      return await this.prismaClient.masterData.findMany({
        where: entityType ? { entityType } : undefined,
      });
    } catch (error) {
      logger.error("Error finding all master data:", error);
      throw new HttpException(500, "Failed to retrieve master data.");
    }
  }

  async findOne(id: number): Promise<MasterData | null> {
    try {
      const masterData = await this.prismaClient.masterData.findUnique({
        where: { id },
      });
      if (!masterData) {
        logger.warn(`Not Found: Master data with ID ${id} not found.`);
        throw new HttpException(404, `Master data with ID ${id} not found.`);
      }
      return masterData;
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP errors
      logger.error(`Error finding master data with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve master data with ID ${id}.`,
      );
    }
  }

  async create(createMasterDataDto: CreateMasterDataDto): Promise<MasterData> {
    try {
      const newMasterData = await this.prismaClient.masterData.create({
        data: createMasterDataDto,
      });

      return newMasterData;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation (P2002)
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Master Data with code '${createMasterDataDto.code}' already exists.`,
          );
          throw new HttpException(
            409,
            `Master Data with name '${createMasterDataDto.code}' already exists.`,
          );
        }
      }
      logger.error("Error creating Master Data:", error);
      throw new HttpException(500, "Failed to create Master Data.");
    }
  }

  async update(
    id: number,
    updateMasterDataDto: UpdateMasterDataDto,
  ): Promise<{
    masterData: MasterData;
    oldValue: MasterData | null;
  }> {
    try {
      const oldValue = await this.findOne(id);
      const newValue = await this.prismaClient.masterData.update({
        where: { id },
        data: updateMasterDataDto,
      });

      return {
        masterData: newValue,
        oldValue,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Handle potential unique constraint violation on update
          logger.warn(
            `Conflict: Master Data code '${updateMasterDataDto.code}' might already be in use.`,
          );
          throw new HttpException(
            409,
            `Master Data code '${updateMasterDataDto.code}' might already be in use.`,
          );
        }
        if (error.code === "P2025") {
          logger.warn(
            `Not Found: Master Data with ID ${id} not found for update.`,
          );
          throw new HttpException(
            404,
            `Master Data with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating master data  with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update master data with ID ${id}.`,
      );
    }
  }
}
