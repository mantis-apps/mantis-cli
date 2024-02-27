/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONTEND_URLS.split(','),
    },
  });

  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;

  await app
    .setGlobalPrefix(globalPrefix)
    // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
    .enableShutdownHooks()
    .listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
