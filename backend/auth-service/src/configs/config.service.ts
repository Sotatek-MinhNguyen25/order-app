import * as dotenv from 'dotenv';
dotenv.config();
export class ConfigService {
    HOST = process.env.HOST || '127.0.0.1';
    PORT: number = Number(process.env.PORT) || 8006;

    DB_HOST: string = process.env.DB_HOST || 'localhost';
    DB_PORT: number = Number(process.env.DB_PORT) || 5432;
    DB_USER = process.env.DB_USER || 'postgres';
    DB_PASSWORD: string = process.env.DB_PASSWORD || 'password';
    DB_NAME: string = process.env.DB_NAME || 'auth_service';

    // JWT
    JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
    AC_TOKEN_EXPIRED = process.env.AC_TOKEN_EXPIRED || '3d';
    RF_TOKEN_EXPIRED = process.env.RF_TOKEN_EXPIRED || '7d';
}

export const authConfig = new ConfigService();
