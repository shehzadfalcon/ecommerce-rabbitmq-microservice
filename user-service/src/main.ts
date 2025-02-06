import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllServiceExceptionFilter } from './filter/all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        // servers: ['nats://nats:4222'],
        urls: ['amqp://user:pass@rabbitmq:5672'],
        queue: 'user_queue',
        queueOptions: {
            durable: false
          },
      },
    }
  );
  app.useGlobalFilters(new AllServiceExceptionFilter());

  await app.listen();
  
}
bootstrap();
