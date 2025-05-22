import { EmploymentStatus } from "@prisma/client";
import { prisma } from "@/server/common/prisma/client"; // Import the singleton instance
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";

export class EmploymentStatusService {
  constructor(private readonly prismaClient = prisma) {}

  async findAll(): Promise<EmploymentStatus[]> {
    try {
      return await this.prismaClient.employmentStatus.findMany();
    } catch (error) {
      logger.error("Error finding all areas:", error);
      throw new HttpException(500, "Failed to retrieve areas.");
    }
  }
}
