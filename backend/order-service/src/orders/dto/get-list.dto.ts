import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min, IsEnum } from "class-validator";
import { OrderStatus } from "../entity/order.enum";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC"
}

export class GetListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({ example: "createdAt" })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.CREATED })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
