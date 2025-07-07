import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OrderEntity } from '../orders/entity/order.entity';
import { ORDER_CONSTANTS } from 'src/constants';

@WebSocketGateway({
    cors: { origin: '*', credentials: true }
})
export class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('OrdersGateway');

    afterInit() {
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    emitOrderUpdated(order: OrderEntity) {
        this.server.emit(ORDER_CONSTANTS.WEBSOCKET_EVENTS.ORDER_UPDATED, {
            id: order.id,
            userId: order.userId,
            productName: order.productName,
            amount: order.amount,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        });
    }

    emitOrderCreated(order: OrderEntity) {
        this.server.emit(ORDER_CONSTANTS.WEBSOCKET_EVENTS.ORDER_CREATED, {
            id: order.id,
            userId: order.userId,
            productName: order.productName,
            amount: order.amount,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        });
    }
}
