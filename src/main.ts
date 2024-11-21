// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Recipe API')
    .setDescription('API documentation for Recipe application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  await app.listen(process.env.PORT || 3000);

  const appUrl = await app.getUrl();
  console.log(`Application is running on: ${appUrl}`);
}
bootstrap();
