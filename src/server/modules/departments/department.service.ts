import { Prisma, Department } from "@prisma/client";

import { DepartmentDetail } from "@/types/department";
import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateDepartmentDto } from "./dtos/create-department.dto";
import { UpdateDepartmentDto } from "./dtos/update-department.dto";

export class DepartmentService {
  constructor(private readonly prismaClient = prisma) {} // Default to singleton

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    try {
      return await this.prismaClient.department.create({
        data: createDepartmentDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation (P2002)
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Department with name '${createDepartmentDto.departmentName}' already exists.`,
          );
          throw new HttpException(
            409,
            `Department with name '${createDepartmentDto.departmentName}' already exists.`,
          );
        }
      }
      logger.error("Error creating department:", error);
      throw new HttpException(500, "Failed to create department.");
    }
  }

  async findAll(): Promise<DepartmentDetail[]> {
    try {
      const departments = await this.prismaClient.department.findMany({
        include: {
          departmentManager: true,
        },
      });

      return departments.map((dept) => {
        return {
          ...dept,
          departmentManager: dept.departmentManager || null,
        };
      });
    } catch (error) {
      logger.error("Error finding all department:", error);
      throw new HttpException(500, "Failed to retrieve department.");
    }
  }

  async findOne(id: number): Promise<Department | null> {
    try {
      const department = await this.prismaClient.department.findUnique({
        where: { id },
      });
      if (!department) {
        logger.warn(`Not Found: Department with ID ${id} not found.`);
        throw new HttpException(404, `Department with ID ${id} not found.`);
      }
      return department;
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP errors
      logger.error(`Error finding department with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to retrieve department with ID ${id}.`,
      );
    }
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentDetail> {
    try {
      // First check if department exists
      await this.findOne(id);

      return await this.prismaClient.department.update({
        where: { id },
        data: updateDepartmentDto,
        include: {
          departmentManager: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP/not found errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Handle potential unique constraint violation on update
          logger.warn(
            `Conflict: Department name '${updateDepartmentDto.departmentName}' might already be in use.`,
          );
          throw new HttpException(
            409,
            `Department name '${updateDepartmentDto.departmentName}' might already be in use.`,
          );
        }
        if (error.code === "P2025") {
          // Record to update not found (already handled by findOne, but good practice)
          logger.warn(
            `Not Found: Department with ID ${id} not found for update.`,
          );
          throw new HttpException(
            404,
            `Department with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating department with ID ${id}:`, error);
      throw new HttpException(
        500,
        `Failed to update department with ID ${id}.`,
      );
    }
  }
}
