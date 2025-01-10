import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.PORT) {
    throw new Error('환경변수에 PORT를 설정해주세요.');
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.HOST as string],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(cookieParser());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('weplate Swagger')
    .setDescription('weplate API description')
    .setVersion('1.0')
    .addTag('weplate')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  // 모든 경로가 /api로 시작하도록 설정
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 7777);
}
bootstrap();
