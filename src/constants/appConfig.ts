import { env } from "process";

export const NEXT_APP_ENV: string = env.NODE_ENV ?? "development";
export const NEXT_APP_AUTH: string = env.APP_AUTH_KEY ?? "APP_AUTH_KEY";
export const API_URL: string = env.APP_API ?? "http://localhost:3000";
