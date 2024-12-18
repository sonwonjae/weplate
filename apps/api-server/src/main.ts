import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.WEB_SERVER_HOST as string,
      process.env.API_SERVER_HOST as string,
    ],
    credentials: true,
  });
  if (!process.env.PORT) {
    throw new Error('환경변수에 PORT를 설정해주세요.');
  }

  // 모든 경로가 /api로 시작하도록 설정
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('momuk Swagger')
    .setDescription('momuk API description')
    .setVersion('1.0')
    .addTag('momuk')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 7777);
}
bootstrap();
