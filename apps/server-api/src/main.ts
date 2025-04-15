import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as es from 'es-toolkit';

import { AppModule } from './app.module';

Array.prototype.shuffle = function shuffle<T>(): T[] {
  return es.shuffle(this as T[]);
};
Array.prototype.draw = function draw<T extends { score: number }>(): T {
  return (this as T[])
    .reduce(
      (acc, currentList: T) => {
        if (currentList.score > acc.maxScore) {
          return { maxScore: currentList.score, resultList: [currentList] };
        } else if (currentList.score === acc.maxScore) {
          acc.resultList.push(currentList);
        }
        return acc;
      },
      { maxScore: -Infinity, resultList: [] as T[] },
    )
    .resultList.shuffle()[0];
};

async function bootstrap() {
  if (!process.env.API_SERVER_PORT) {
    throw new Error('환경변수에 API_SERVER_PORT를 설정해주세요.');
  }

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });
  app.enableCors({
    origin: true,
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
  await app.listen(process.env.API_SERVER_PORT ?? 7777);
}
bootstrap();
