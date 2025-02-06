import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { TimeoutInterceptor } from './interceptors/serialize.interceptor';
import {  AllServiceExceptionFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const config = new DocumentBuilder()
  .setTitle('Microservices ')
  .setDescription('The Microservices API description')
  .setVersion('1.0')
  .addTag('microservices')
  .addBearerAuth()
  .build();
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, documentFactory);
app.useGlobalInterceptors(new TimeoutInterceptor());
app.enableCors({
  origin: process.env.CLIENT_URL,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  credentials: true,
});

const { httpAdapter } = app.get(HttpAdapterHost);

app.useGlobalFilters(new AllServiceExceptionFilter());
await app.startAllMicroservices();
  await app.listen(PORT, () =>
    console.log(`Application is running on port ${PORT}`),
  );
}
bootstrap();
