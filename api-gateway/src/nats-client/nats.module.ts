import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ARTICLES_SERVICE',
        transport: Transport.RMQ,
        options: {
          // servers: ['nats://nats:4222'],
          urls: ['amqp://user:pass@rabbitmq:5672'],
          queue: 'articles_queue',
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
        name: 'ARTICLES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:pass@rabbitmq:5672'],
          queue: 'readers_queue',
          queueOptions: {
            durable: false
          },
          // servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
})
export class NatsClientModule {}
