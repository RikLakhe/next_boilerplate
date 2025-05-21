import { Prisma, Designation } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client"; // Import the singleton instance
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateDesignationDto } from "./dtos/create-designation.dto";
import { UpdateDesignationDto } from "./dtos/update-designation.dto";

export class DesignationService {
  // Dependency injection is implicit via importing the singleton 'prisma' instance
  // If using a DI container later, you'd inject PrismaClient here.
  constructor(private readonly prismaClient = prisma) {} // Default to singleton

  async create(
    createDesignationDto: CreateDesignationDto,
  ): Promise<Designation> {
    try {
      return await this.prismaClient.designation.create({
        data: createDesignationDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation (P2002)
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Designation with name '${createDesignationDto.title}' already exists.`,
          );
          throw new HttpException(
            409,
            `Designation with name '${createDesignationDto.title}' already exists.`,
          );
        }
      }
      logger.error("Error creating designation:", error);
      throw new HttpException(500, "Failed to create designation.");
    }
  }

  async findAll(): Promise<Designation[]> {
    try {
      return await this.prismaClient.designation.findMany();
    } catch (error) {
      logger.error("Error finding all Designation:", error);
      throw new HttpException(500, "Failed to retrieve Designation.");
    }
  }

  async findOne(id: number): Promise<Designation | null> {
    try {
      const designation = await this.prismaClient.designation.findUnique({
        where: { id },
      });
      if (!designation) {
        logger.warn(`Not Found: Designation with ID ${id} not found.`);
        throw new HttpException(404, `Designation with ID ${id} not found.`);
      }
      return designation;
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP errors
      logger.error(`Error finding designation with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve Designation with ID ${id}.`,
      );
    }
  }

  async update(
    id: number,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    try {
      await this.findOne(id);

      return await this.prismaClient.designation.update({
        where: { id },
        data: updateDesignationDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Handle potential unique constraint violation on update
          logger.warn(
            `Conflict: Designation name '${updateDesignationDto.title}' might already be in use.`,
          );
          throw new HttpException(
            409,
            `Designation name '${updateDesignationDto.title}' might already be in use.`,
          );
        }
        if (error.code === "P2025") {
          // Record to update not found (already handled by findOne, but good practice)
          logger.warn(
            `Not Found: Designation with ID ${id} not found for update.`,
          );
          throw new HttpException(
            404,
            `Designation with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating designation with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update designation with ID ${id}.`,
      );
    }
  }

  async remove(id: number): Promise<Designation> {
    try {
      // First check if Designation exists
      await this.findOne(id);

      return await this.prismaClient.designation.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          // Record to delete not found
          logger.warn(
            `Not Found: Designation with ID ${id} not found for deletion.`,
          );
          throw new HttpException(
            404,
            `Designation with ID ${id} not found for deletion.`,
          );
        }
        if (error.code === "P2003") {
          logger.warn(
            `Conflict: Cannot delete Designation with ID ${id} as it is referenced elsewhere.`,
          );
          throw new HttpException(
            409,
            `Cannot delete Designation with ID ${id} as it is referenced elsewhere.`,
          );
        }
      }
      logger.error(`Error removing Designation with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to remove Designation with ID ${id}.`,
      );
    }
  }
}
