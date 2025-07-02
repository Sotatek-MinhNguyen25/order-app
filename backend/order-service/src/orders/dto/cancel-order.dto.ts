import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CancelOrderDto {
  @ApiProperty({
    example: "b77b2fd2-bf39-4e2c-a9be-6e2c6c000001",
    format: "uuid"
  })
  @IsUUID()
  orderId: string;
}
