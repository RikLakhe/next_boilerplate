import { PrismaClient } from "@prisma/client";

/**
 * Service for managing Prisma database connections
 */
export class PrismaService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Get the Prisma client instance
     */
    get client(): PrismaClient {
        return this.prisma;
    }

    /**
     * Connect to the database
     */
    async connect(): Promise<void> {
        try {
            await this.prisma.$connect();
            console.log("Connected to database successfully");
        } catch (error) {
            console.error("Failed to connect to database:", error);
            throw error;
        }
    }

    /**
     * Disconnect from the database
     */
    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
        console.log("Disconnected from database");
    }
}
