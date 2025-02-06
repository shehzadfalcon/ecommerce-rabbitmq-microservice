import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {  AllServiceExceptionFilter } from './filter/all-exceptions.filter';
import { HttpExceptionsFilter } from './filter/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:pass@rabbitmq:5672'],
        queue: 'product_queue',
        queueOptions: {
            durable: false
          },
      },
    }
  );
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new HttpExceptionsFilter(),
    new AllServiceExceptionFilter(),
  );
  await app.listen();
  
}
bootstrap();
