import { IsUUID, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentRequestDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty()
  @IsString()
  token: string;
}
