import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Thêm import
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('SSO NestJS API')
    .setDescription('API documentation for SSO system built with NestJS')
    .setVersion('1.0')
    .addBearerAuth() // Thêm hỗ trợ Bearer Token
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // Đặt endpoint Swagger tại /api

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
