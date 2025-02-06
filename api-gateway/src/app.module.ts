import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AMQClientModule } from './amq-client/amq-client.module';
import { ProductController } from './modules/product.controller';
import { UsersController } from './modules/user.controller';
import { AuthController } from './modules/auth.controller';
// import { NatsClientModule } from './nats-client/nats.module';

@Module({
  imports: [AMQClientModule],
  controllers: [ProductController,UsersController,AuthController],
  providers: [],
})
export class AppModule {}