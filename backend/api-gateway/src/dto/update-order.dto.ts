import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "src/orders/order.enum";

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.CREATED })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
