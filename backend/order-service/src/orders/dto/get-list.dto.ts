import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min, IsEnum } from "class-validator";
import { OrderStatus } from "../entity/order.enum";
import { ORDER_CONSTANTS } from "src/constants";

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
  page: number = ORDER_CONSTANTS.DEFAULT_PAGE;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = ORDER_CONSTANTS.DEFAULT_LIMIT;

  @ApiPropertyOptional({ example: "createdAt" })
  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @ApiPropertyOptional({ enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.CREATED })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
