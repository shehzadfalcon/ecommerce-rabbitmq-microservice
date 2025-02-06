import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          // servers: ['nats://nats:4222'],
          urls: ['amqp://user:pass@rabbitmq:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          // servers: ['nats://nats:4222'],
          urls: ['amqp://user:pass@rabbitmq:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],

  exports: [
    ClientsModule.register([
        {
            name: 'USER_SERVICE',
            transport: Transport.RMQ,
            options: {
              // servers: ['nats://nats:4222'],
              urls: ['amqp://user:pass@rabbitmq:5672'],
              queue: 'user_queue',
              queueOptions: {
                durable: false
              },
            },
          },
          {
            name: 'PRODUCT_SERVICE',
            transport: Transport.RMQ,
            options: {
              // servers: ['nats://nats:4222'],
              urls: ['amqp://user:pass@rabbitmq:5672'],
              queue: 'product_queue',
              queueOptions: {
                durable: false
              },
            },
          },
    ]),
  ],
})
export class AMQClientModule {}
