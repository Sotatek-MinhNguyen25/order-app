import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "./entity/order.enum";
import { ClientProxy } from "@nestjs/microservices";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GetListDto } from "./dto/get-list.dto";
import { paginate } from "src/common/pagination/pagination.util";
import {
  OrderResponse,
  PaginatedOrderResponse
} from "./dto/order-response.dto";
import { ORDER_CONSTANTS } from "src/constants";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(ORDER_CONSTANTS.RABBITMQ_PAYMENT_SERVICE)
    private readonly clientOrder: ClientProxy,
    @Inject(ORDER_CONSTANTS.RABBITMQ_MAIL_SERVICE)
    private readonly clientMail: ClientProxy
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const order: OrderEntity = this.orderRepository.create({
      ...dto,
      status: OrderStatus.CREATED
    });

    const savedOrder: OrderEntity = await this.orderRepository.save(order);

    this.clientOrder.emit(ORDER_CONSTANTS.EVENTS.ORDER_CREATED, {
      orderId: savedOrder.id,
      amount: savedOrder.amount,
      userId: savedOrder.userId,
      token: ORDER_CONSTANTS.DEFAULT_PAYMENT_TOKEN
    });

    return {
      data: savedOrder
    };
  }

  async handlePaymentResult(data: {
    orderId: string;
    status: string;
  }): Promise<void> {
    const order: OrderEntity | null = await this.orderRepository.findOneBy({
      id: data.orderId
    });
    if (!order) return;
    order.status =
      data.status === "confirmed"
        ? OrderStatus.CONFIRMED
        : OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    this.clientMail.emit(ORDER_CONSTANTS.EVENTS.ORDER_SEND_MAIL, {
      to: ORDER_CONSTANTS.DEFAULT_EMAIL_RECIPIENT,
      order: {
        id: order.id,
        productName: order.productName,
        amount: order.amount,
        status: order.status
      }
    });
  }

  async updateOrder(
    orderId: string,
    status: OrderStatus
  ): Promise<OrderResponse> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException("Order not found");
    const currentStatus = order.status;

    if (
      currentStatus === OrderStatus.CANCELLED ||
      currentStatus === OrderStatus.DELIVERED
    )
      throw new BadRequestException(
        `Cannot update order in status '${currentStatus}'`
      );

    if (
      status === OrderStatus.CANCELLED &&
      currentStatus !== OrderStatus.CREATED &&
      currentStatus !== OrderStatus.CONFIRMED
    ) {
      throw new BadRequestException("Order cannot be cancelled");
    }

    if (
      status === OrderStatus.DELIVERED &&
      currentStatus !== OrderStatus.CONFIRMED
    )
      throw new BadRequestException("Order cannot delivered");

    order.status = status;
    await this.orderRepository.save(order);

    this.clientMail.emit(ORDER_CONSTANTS.EVENTS.ORDER_SEND_MAIL, {
      to: ORDER_CONSTANTS.DEFAULT_EMAIL_RECIPIENT,
      order: {
        id: order.id,
        productName: order.productName,
        amount: order.amount,
        status: order.status
      }
    });

    return { data: order };
  }

  async getOrderById(orderId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException("Order not found");
    return {
      data: order
    };
  }

  async getAllOrders(dto: GetListDto): Promise<PaginatedOrderResponse> {
    const query = await this.orderRepository.createQueryBuilder("order");
    if (dto.search) {
      query.where("order.productName LIKE :search", {
        search: `%${dto.search}%`
      });
    }
    if (dto.status) {
      query.andWhere("order.status =:status", { status: `${dto.status}` });
    }

    query.orderBy(`order.${dto.sortBy}`, dto.sortOrder);

    return paginate(query, dto.page, dto.limit);
  }
}
