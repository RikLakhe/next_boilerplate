import { Prisma, Event } from "@prisma/client";

import { prisma } from "@/server/common/prisma/client"; // Import the singleton instance
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";

import { CreateEventDto } from "./dtos/create-events.dto";
import { UpdateEventDto } from "./dtos/update-events.dto";

export class EventsService {
  constructor(private readonly prismaClient = prisma) {}

  async findOne(id: number): Promise<Event | null> {
    try {
      const event = await this.prismaClient.event.findUnique({
        where: { id },
        include: {
          eventType: true,
        },
      });
      if (!event) {
        logger.warn(`Not Found: Event with ID ${id} not found.`);
        throw new HttpException(404, `Event with ID ${id} not found.`);
      }
      return event;
    } catch (error) {
      if (error instanceof HttpException) throw error; // Re-throw known HTTP errors
      logger.error(`Error finding event with ID ${id}:`, error);
      throw new HttpException(500, `Failed to retrieve event with ID ${id}.`);
    }
  }

  async findAll(): Promise<Event[]> {
    try {
      return await this.prismaClient.event.findMany({
        include: {
          eventType: true,
        },
      });
    } catch (error) {
      logger.error("Error finding all event:", error);
      throw new HttpException(500, "Failed to retrieve event.");
    }
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const newEvent = await this.prismaClient.event.create({
        data: createEventDto,
      });

      return newEvent;
    } catch (error) {
      logger.error("Error creating Event:", error);
      throw new HttpException(500, "Failed to create Event.");
    }
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<{ event: Event; oldValue: Event | null }> {
    try {
      const oldValue = await this.findOne(id);
      const newEvent = await this.prismaClient.event.update({
        where: { id },
        data: updateEventDto,
      });

      return {
        event: newEvent,
        oldValue,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          logger.warn(`Not Found: Event with ID ${id} not found for update.`);
          throw new HttpException(
            404,
            `Event with ID ${id} not found for update.`,
          );
        }
      }
      logger.error(`Error updating event with ID ${id}:`, error);
      throw new HttpException(500, `Failed to update event with ID ${id}.`);
    }
  }
}
