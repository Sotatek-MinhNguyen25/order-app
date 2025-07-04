import { IsEnum } from "class-validator";
import { OrderStatus } from "../entity/order.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.CREATED })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
