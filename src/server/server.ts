import { bootstrap } from './core/bootstrap';

/**
 * Entry point for the server application
 */
async function startServer() {
    try {
        await bootstrap();
        console.log('Server initialized successfully');
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Only run if this file is executed directly (not imported)
if (require.main === module) {
    startServer();
}

export { startServer };