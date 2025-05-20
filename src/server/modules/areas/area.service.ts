import { Prisma, Area } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client"; // Import the singleton instance
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateAreaDto } from "./dtos/create-area.dto";
import { UpdateAreaDto } from "./dtos/update-area.dto";

export class AreasService {
  // Dependency injection is implicit via importing the singleton 'prisma' instance
  // If using a DI container later, you'd inject PrismaClient here.
  constructor(private readonly prismaClient = prisma) {} // Default to singleton

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    try {
      return await this.prismaClient.area.create({
        data: createAreaDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation (P2002)
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Area with name '${createAreaDto.name}' already exists.`,
          );
          throw new HttpException(
            409,
            `Area with name '${createAreaDto.name}' already exists.`,
          );
        }
      }
      logger.error("Error creating area:", error);
      throw new HttpException(500, "Failed to create area.");
    }
  }

  async findAll(): Promise<Area[]> {
    try {
      return await this.prismaClient.area.findMany();
    } catch (error) {
      logger.error("Error finding all areas:", error);
      throw new HttpException(500, "Failed to retrieve areas.");
    }
  }

  async findOne(id: number): Promise<Area | null> {
    try {
      const area = await this.prismaClient.area.findUnique({
        where: { id },
      });
      if (!area) {
        logger.warn(`Not Found: Area with ID ${id} not found.`);
        throw new HttpException(404, `Area with ID ${id} not found.`);
      }
      return area;
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP errors
      logger.error(`Error finding area with ID ${id}:`, error);
      throw new HttpException(500, `Failed to retrieve area with ID ${id}.`);
    }
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    try {
      // First check if area exists
      await this.findOne(id);

      return await this.prismaClient.area.update({
        where: { id },
        data: updateAreaDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Handle potential unique constraint violation on update
          logger.warn(
            `Conflict: Area name '${updateAreaDto.name}' might already be in use.`,
          );
          throw new HttpException(
            409,
            `Area name '${updateAreaDto.name}' might already be in use.`,
          );
        }
        if (error.code === "P2025") {
          // Record to update not found (already handled by findOne, but good practice)
          logger.warn(`Not Found: Area with ID ${id} not found for update.`);
          throw new HttpException(
            404,
            `Area with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating area with ID ${id}:`, error);
      throw new HttpException(500, `Failed to update area with ID ${id}.`);
    }
  }

  async remove(id: number): Promise<Area> {
    try {
      // First check if area exists
      await this.findOne(id);

      return await this.prismaClient.area.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          // Record to delete not found
          logger.warn(`Not Found: Area with ID ${id} not found for deletion.`);
          throw new HttpException(
            404,
            `Area with ID ${id} not found for deletion.`,
          );
        }
        // Handle potential foreign key constraint errors (P2003) if areas are linked elsewhere
        if (error.code === "P2003") {
          logger.warn(
            `Conflict: Cannot delete area with ID ${id} as it is referenced elsewhere.`,
          );
          throw new HttpException(
            409,
            `Cannot delete area with ID ${id} as it is referenced elsewhere.`,
          );
        }
      }
      logger.error(`Error removing area with ID ${id}:`, error);
      throw new HttpException(500, `Failed to remove area with ID ${id}.`);
    }
  }
}
