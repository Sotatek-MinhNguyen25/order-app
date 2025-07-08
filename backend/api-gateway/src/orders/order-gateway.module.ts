import { Module } from "@nestjs/common";
import { OrderGatewayController } from "./order-gateway.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [OrderGatewayController],
    exports: [],
})

export class OrderGatewayModule { }