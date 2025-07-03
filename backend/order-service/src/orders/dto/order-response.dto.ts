import { OrderEntity } from "../entity/order.entity";

export interface OrderResponse {
  data: OrderEntity;
}

export interface PaginatedOrderResponse {
  data: OrderEntity[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
