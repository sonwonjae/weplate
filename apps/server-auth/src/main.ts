import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.PORT) {
    throw new Error('환경변수에 PORT를 설정해주세요.');
  }

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });
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
    .setTitle('auth Swagger')
    .setDescription('auth API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/user/docs', app, document);

  // 모든 경로가 /api/user로 시작하도록 설정
  app.setGlobalPrefix('api/user');
  await app.listen(process.env.PORT ?? 5555);
}
bootstrap();
