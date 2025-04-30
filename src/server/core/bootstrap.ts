import { AppModule } from '../app.module';
import { PrismaService } from '../database/prisma.service';

/**
 * Bootstraps the application:
 * - Initializes services
 * - Sets up database connections
 * - Prepares the application for handling requests
 */
export async function bootstrap() {
    const app = AppModule.getInstance();

    // Initialize Prisma
    const prismaService = app.getService(PrismaService);
    if (!prismaService) {
        throw new Error('PrismaService not found');
    }

    await prismaService.connect();

    // Register shutdown hooks
    process.on('SIGINT', async () => {
        await gracefulShutdown();
    });

    process.on('SIGTERM', async () => {
        await gracefulShutdown();
    });

    return app;
}

/**
 * Performs graceful shutdown of services
 */
async function gracefulShutdown() {
    console.log('Shutting down server gracefully...');

    const app = AppModule.getInstance();
    const prismaService = app.getService(PrismaService);

    if (prismaService) {
        await prismaService.disconnect();
    }

    console.log('Server shutdown complete');
    process.exit(0);
}