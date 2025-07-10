import { DataSource } from 'typeorm';
import { authConfig } from './config.service';

const TypeormConfig = new DataSource({
  type: 'postgres',
  host: authConfig.DB_HOST,
  port: authConfig.DB_PORT,
  username: authConfig.DB_USER,
  password: authConfig.DB_PASSWORD,
  database: authConfig.DB_NAME,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: false,
});

export default TypeormConfig;
