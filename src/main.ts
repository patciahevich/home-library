import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 4000);
  app.setGlobalPrefix('app');

  const apiSpec: OpenAPIObject = yaml.load(
    fs.readFileSync(path.resolve(__dirname, '../doc/api.yaml'), 'utf-8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('app/docs', app, apiSpec);

  await app.listen(PORT);
}
bootstrap();
