import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 4000);

  const loggingService = app.get(LoggingService);
  app.useGlobalFilters(new CustomExceptionFilter(loggingService));

  process.on('uncaughtException', (err) => {
    loggingService.error(`Uncaught Exception: ${err.message}`, err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(`Unhandled Rejection: ${reason}`);
  });

  const apiSpec: OpenAPIObject = yaml.load(
    fs.readFileSync(path.resolve(__dirname, '../doc/api.yaml'), 'utf-8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('/doc', app, apiSpec);

  await app.listen(PORT);
}
bootstrap();
