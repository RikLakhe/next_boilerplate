import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './database/prisma.service';

/**
 * Root application module that brings together all the feature modules
 * and provides application-wide services
 */
export class AppModule {
    private static _instance: AppModule;
    private _modules: any[] = [];
    private _services: any[] = [];

    private constructor() {
        // Register core services
        this._services = [new PrismaService()];

        // Register modules
        this._modules = [new UsersModule()];
    }

    public static getInstance(): AppModule {
        if (!AppModule._instance) {
            AppModule._instance = new AppModule();
        }
        return AppModule._instance;
    }

    public getModules() {
        return this._modules;
    }

    public getServices() {
        return this._services;
    }

    // Get a specific service by type
    public getService<T>(type: new (...args: any[]) => T): T | undefined {
        return this._services.find(service => service instanceof type) as T;
    }
}