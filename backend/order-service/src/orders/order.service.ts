import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "./entity/order.enum";
import { ClientProxy } from "@nestjs/microservices";
import { CreateOrderDto } from "./dto/create-order.dto";
import { MailService } from "../mail/mail.service";
import { GetListDto } from "./dto/get-list.dto";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject("RABBITMQ_SERVICE") private readonly client: ClientProxy,
    private readonly mailService: MailService
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const order: OrderEntity = this.orderRepository.create({
      ...dto,
      status: OrderStatus.CREATED
    });

    const savedOrder: OrderEntity = await this.orderRepository.save(order);
    this.client.emit("order.created", {
      orderId: savedOrder.id,
      amount: savedOrder.amount,
      userId: savedOrder.userId,
      token: "my_token"
    });

    return {
      status: 200,
      message: "Order created successfully",
      data: savedOrder
    };
  }

  async handlePaymentResult(data: { orderId: string; status: string }) {
    const order: OrderEntity | null = await this.orderRepository.findOneBy({
      id: data.orderId
    });
    if (!order) return;
    order.status =
      data.status === "confirmed"
        ? OrderStatus.CONFIRMED
        : OrderStatus.CANCELLED;
    await this.mailService.sendMailStatusOrder(
      order,
      "nguyenquangminh15092003@gmail.com"
    );
    await this.orderRepository.save(order);
    if (order.status === OrderStatus.CONFIRMED) {
      setTimeout(async () => {
        const confirmedOrder = await this.orderRepository.findOneBy({
          id: order.id
        });
        if (confirmedOrder && confirmedOrder.status === OrderStatus.CONFIRMED) {
          confirmedOrder.status = OrderStatus.DELIVERED;
          await this.orderRepository.save(confirmedOrder);

          await this.mailService.sendMailStatusOrder(
            confirmedOrder,
            "nguyenquangminh15092003@gmail.com"
          );
        }
      }, 30000);
    }
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException("Order not found");
    if (
      order.status !== OrderStatus.CONFIRMED &&
      order.status !== OrderStatus.CREATED
    ) {
      throw new BadRequestException("Order cannot be cancelled");
    }

    order.status = OrderStatus.CANCELLED;
    await this.mailService.sendMailStatusOrder(
      order,
      "nguyenquangminh15092003@gmail.com"
    );
    await this.orderRepository.save(order);

    return {
      status: 200,
      message: "Order cancelled successfully"
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException("Order not found");
    return {
      status: 200,
      message: "Get order detail success",
      data: order
    };
  }

  async getAllOrders(dto: GetListDto) {
    const query = await this.orderRepository.createQueryBuilder("order");
    if (dto.search) {
      query.where("order.productName LIKE :search", {
        search: `%${dto.search}%`
      });
    }

    query
      .orderBy(`order.${dto.sortBy}`, dto.sortOrder)
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit);
    const [orders, total] = await query.getManyAndCount();

    return {
      status: 200,
      message: "Get all orders success",
      data: orders,
      meta: {
        currentPage: dto.page,
        pageSize: dto.limit,
        totalItems: total,
        totalPages: Math.ceil(total / dto.limit)
      }
    };
  }
}
