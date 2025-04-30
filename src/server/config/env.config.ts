import dotenv from "dotenv";

/**
 * Environment configuration service
 */
export class EnvConfig {
  private static _instance: EnvConfig;

  private constructor() {
    // Load environment variables from .env file
    dotenv.config();
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig._instance) {
      EnvConfig._instance = new EnvConfig();
    }
    return EnvConfig._instance;
  }

  /**
   * Get an environment variable
   * @param key The environment variable key
   * @param defaultValue Optional default value if key is not found
   */
  public get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || "";
  }

  /**
   * Get a number environment variable
   * @param key The environment variable key
   * @param defaultValue Optional default value if key is not found
   */
  public getNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue !== undefined ? defaultValue : 0;
    }
    return Number(value);
  }

  /**
   * Get a boolean environment variable
   * @param key The environment variable key
   * @param defaultValue Optional default value if key is not found
   */
  public getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue !== undefined ? defaultValue : false;
    }
    return value.toLowerCase() === "true";
  }
}
