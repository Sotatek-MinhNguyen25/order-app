import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RABBITMQ_ORDER_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://root:password@localhost:5672'],
                    queue: 'order_queue',
                    queueOptions: { durable: true },
                },
            },
        ]),
    ],
    providers: [],
    exports: [ClientsModule],
})
export class RabbitMQModule { }
