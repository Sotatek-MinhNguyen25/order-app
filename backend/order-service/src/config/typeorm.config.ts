import { DataSource } from "typeorm";
import { orderConfig } from "./order-config.service";

const TypeormConfig = new DataSource({
  type: "postgres",
  host: orderConfig.DB_HOST,
  port: orderConfig.DB_PORT,
  username: orderConfig.DB_USER,
  password: orderConfig.DB_PASSWORD,
  database: orderConfig.DB_NAME,
  synchronize: false,
  entities: ["**/*.entity.ts"],
  migrations: ["src/migrations/*-migration.ts"],
  migrationsRun: false,
  logging: false
});

export default TypeormConfig;
