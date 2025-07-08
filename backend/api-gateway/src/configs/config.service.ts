import * as dotenv from 'dotenv';
dotenv.config();

export class ConfigService {
    // Common default
    private readonly DEFAULT_HOST = '127.0.0.1';

    readonly API_PREFIX = process.env.API_PREFIX || "api/v1"

    // ORDER
    readonly ORDER_SERVICE = process.env.ORDER_SERVICE || 'ORDER_SERVICE';
    readonly ORDER_HOST = process.env.ORDER_HOST || this.DEFAULT_HOST;
    readonly ORDER_PORT = parseInt(process.env.ORDER_PORT || '8001', 10);

    // PAYMENT
    readonly PAYMENT_SERVICE = process.env.PAYMENT_SERVICE || 'PAYMENT_SERVICE';
    readonly PAYMENT_HOST = process.env.PAYMENT_HOST || this.DEFAULT_HOST;
    readonly PAYMENT_PORT = parseInt(process.env.PAYMENT_PORT || '8002', 10);

    // NOTIFICATION
    readonly NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || 'NOTIFICATION_SERVICE';
    readonly NOTIFICATION_HOST = process.env.NOTIFICATION_HOST || this.DEFAULT_HOST;
    readonly NOTIFICATION_PORT = parseInt(process.env.NOTIFICATION_PORT || '8003', 10);

    // Other shared configs (optional)
    readonly ENV = process.env.NODE_ENV || 'development';
}

export const config = new ConfigService()
