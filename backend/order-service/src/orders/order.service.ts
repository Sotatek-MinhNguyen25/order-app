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
import { OrdersGateway } from "./orders.gateway";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(ORDER_CONSTANTS.RABBITMQ_PAYMENT_SERVICE)
    private readonly clientOrder: ClientProxy,
    @Inject(ORDER_CONSTANTS.RABBITMQ_MAIL_SERVICE)
    private readonly clientMail: ClientProxy,
    private readonly ordersGateway: OrdersGateway
  ) { }

  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const order = this.orderRepository.create({
      ...dto,
      status: OrderStatus.CREATED,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Emit sau 10 giây
    setTimeout(() => {
      this.emitOrderCreated(savedOrder);
    }, 10_000);

    this.emitOrderRealtime(savedOrder);

    return { data: savedOrder };
  }

  async handlePaymentResult(data: {
    orderId: string;
    status: string;
  }): Promise<OrderEntity> {
    const order = await this.orderRepository.findOneBy({ id: data.orderId });
    if (!order) throw new BadRequestException("ORDER.NOT_FOUND");

    order.status =
      data.status === "confirmed"
        ? OrderStatus.CONFIRMED
        : OrderStatus.CANCELLED;

    const updatedOrder = await this.orderRepository.save(order);

    await this.sendOrderUpdated(updatedOrder);

    return updatedOrder;
  }

  async updateOrder(orderId: string, status: OrderStatus): Promise<OrderResponse> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException("Order not found");

    const currentStatus = order.status;

    if ([OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(currentStatus)) {
      throw new BadRequestException(`Cannot update order in status '${currentStatus}'`);
    }

    if (
      status === OrderStatus.CANCELLED &&
      ![OrderStatus.CREATED, OrderStatus.CONFIRMED].includes(currentStatus)
    ) {
      throw new BadRequestException("Order cannot be cancelled");
    }

    if (status === OrderStatus.DELIVERED && currentStatus !== OrderStatus.CONFIRMED) {
      throw new BadRequestException("Order cannot be delivered");
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    await this.sendOrderUpdated(updatedOrder);

    return { data: updatedOrder };
  }
  async retryPayment(orderId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException("ORDER.NOT_FOUND");

    if (order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException("ORDER.NOT.RETRY_PAYMENT");
    }

    // Gửi yêu cầu thanh toán và chờ kết quả
    const result = await firstValueFrom(
      this.clientOrder.send(ORDER_CONSTANTS.EVENTS.ORDER_CREATED, {
        orderId: order.id,
        amount: order.amount,
        userId: order.userId,
        token: ORDER_CONSTANTS.DEFAULT_PAYMENT_TOKEN,
      }),
    );

    const updatedOrder = await this.handlePaymentResult(result);
    return { data: updatedOrder };
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

  private emitOrderCreated(order: OrderEntity) {
    this.clientOrder.emit(ORDER_CONSTANTS.EVENTS.ORDER_CREATED, {
      orderId: order.id,
      amount: order.amount,
      userId: order.userId,
      token: ORDER_CONSTANTS.DEFAULT_PAYMENT_TOKEN,
    });
  }

  private emitOrderRealtime(order: OrderEntity) {
    this.ordersGateway.emitOrderUpdated(order);
  }

  private async sendOrderUpdated(order: OrderEntity) {
    // Gửi mail
    this.clientMail.emit(ORDER_CONSTANTS.EVENTS.ORDER_SEND_MAIL, {
      to: ORDER_CONSTANTS.DEFAULT_EMAIL_RECIPIENT,
      order: {
        id: order.id,
        productName: order.productName,
        amount: order.amount,
        status: order.status,
      },
    });

    // Gửi WebSocket
    this.emitOrderRealtime(order);
  }
}
