import { Prisma, AuditLog as AuditLogType } from "@prisma/client";

import { prisma } from "@/server/common/prisma/client";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { CreateAuditLogsDto } from "./dtos/create_auditLog.dto";

export class AuditLogsService {
  constructor(private readonly prismaClient = prisma) {}

  async create(
    createAuditLogsDto: CreateAuditLogsDto,
  ): Promise<AuditLogType | undefined> {
    try {
      const newLogData = await this.prismaClient.auditLog.create({
        data: {
          ...createAuditLogsDto,
        },
      });

      return newLogData;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation (P2002)
        if (error.code === "P2002") {
          logger.warn(
            `Conflict: Audit log '${createAuditLogsDto.entity}' already exists.`,
          );
          throw new HttpException(
            409,
            `Audit log with id '${createAuditLogsDto.entity}' already exists.`,
          );
        }
      }
      logger.error(new Error(`Error creating Audit Log: ${error}`));
      throw new HttpException(500, "Failed to create Audit Log.");
    }
  }
}
