export const APP_CONSTANTS = {
    DEFAULT_PORT: 3000,
    DEFAULT_HOST: 'localhost',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: '1d',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydatabase',
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_TEST: process.env.NODE_ENV === 'test'
};