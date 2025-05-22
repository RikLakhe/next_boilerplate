import { Prisma, User } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client"; // Import the singleton instance
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

export class UsersService {
  // Dependency injection is implicit via importing the singleton 'prisma' instance
  // If using a DI container later, you'd inject PrismaClient here.
  constructor(private readonly prismaClient = prisma) {} // Default to singleton

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prismaClient.user.create({
        data: createUserDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation (P2002)
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Area with name '${createUserDto.fullName}' already exists.`,
          );
          throw new HttpException(
            409,
            `Area with name '${createUserDto.fullName}' already exists.`,
          );
        }
      }
      logger.error("Error creating area:", error);
      throw new HttpException(500, "Failed to create area.");
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prismaClient.user.findMany();
    } catch (error) {
      logger.error("Error finding all users:", error);
      throw new HttpException(500, "Failed to retrieve users.");
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id },
      });
      if (!user) {
        logger.warn(`Not Found: User with ID ${id} not found.`);
        throw new HttpException(404, `User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP errors
      logger.error(`Error finding area with ID ${id}:`, error);
      throw new HttpException(500, `Failed to retrieve area with ID ${id}.`);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ newValue: User; oldValue: User }> {
    try {
      const oldValue = await this.findOne(id);

      const newValue = await this.prismaClient.user.update({
        where: { id },
        data: updateUserDto,
      });

      return {
        newValue,
        oldValue,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Handle potential unique constraint violation on update
          logger.warn(
            `Conflict: User name '${updateUserDto.fullName}' might already be in use.`,
          );
          throw new HttpException(
            409,
            `User name '${updateUserDto.fullName}' might already be in use.`,
          );
        }
        if (error.code === "P2025") {
          // Record to update not found (already handled by findOne, but good practice)
          logger.warn(`Not Found: User with ID ${id} not found for update.`);
          throw new HttpException(
            404,
            `User with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating user with ID ${id}:`, error);
      throw new HttpException(500, `Failed to update user with ID ${id}.`);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      // First check if user exists
      await this.findOne(id);

      return await this.prismaClient.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          // Record to delete not found
          logger.warn(`Not Found: User with ID ${id} not found for deletion.`);
          throw new HttpException(
            404,
            `User with ID ${id} not found for deletion.`,
          );
        }
        // Handle potential foreign key constraint errors (P2003) if user are linked elsewhere
        if (error.code === "P2003") {
          logger.warn(
            `Conflict: Cannot delete user with ID ${id} as it is referenced elsewhere.`,
          );
          throw new HttpException(
            409,
            `Cannot delete user with ID ${id} as it is referenced elsewhere.`,
          );
        }
      }
      logger.error(`Error removing user with ID ${id}:`, error);
      throw new HttpException(500, `Failed to remove user with ID ${id}.`);
    }
  }
}
