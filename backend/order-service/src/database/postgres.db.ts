import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "../orders/entity/order.entity";
import { orderConfig } from "src/config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: orderConfig.DB_HOST,
      port: orderConfig.DB_PORT,
      username: orderConfig.DB_USER,
      password: orderConfig.DB_PASSWORD,
      database: orderConfig.DB_NAME,
      synchronize: false,
      entities: [OrderEntity]
    })
  ]
})
export class DatabaseModule { }
