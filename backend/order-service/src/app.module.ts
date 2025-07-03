import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OrderModule } from "./orders/order.module";
import { DatabaseModule } from "./database/postgres.db";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    // DB
    DatabaseModule,


    // Module
    OrderModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule { }
