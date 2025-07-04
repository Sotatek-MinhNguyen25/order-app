import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { OrderEntity } from "./entity/order.entity";

@WebSocketGateway({ cors: true })
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitOrderStatusUpdate(order: OrderEntity) {
    this.server.emit("order.status", order);
  }
}
