import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "../orders/entity/order.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "order_service",
      synchronize: true,
      entities: [OrderEntity]
    })
  ]
})
export class DatabaseModule {}
