import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Resolve public directory reliably across dev (ts-node) and prod (dist)
  const candidatePublicDirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, '..', 'public'),
    path.join(process.cwd(), 'dist', 'public'),
    path.join(process.cwd(), 'public'),
  ];
  const publicDir = candidatePublicDirs.find((dir) => fs.existsSync(dir)) || path.join(process.cwd(), 'public');

  // Static Assets (Brand logos, vendor libraries)
  app.useStaticAssets(path.join(publicDir, 'images'), {
    prefix: '/images/',
  });
  app.useStaticAssets(path.join(publicDir, 'vendor'), {
    prefix: '/vendor/',
  });
  app.useStaticAssets(publicDir, {
    prefix: '/public/',
  });

  // Cookie parser for JWT session cookie
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Checkpoint Systems - Technical Request & Maintenance API')
    .setDescription('Hệ thống Quản lý & Nhập liệu Phiếu Yêu cầu Kỹ thuật theo kiến trúc NestJS')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Checkpoint Technical Server is running on: http://localhost:${port}`);
  logger.log(`📱 User Dashboard available at: http://localhost:${port}/dashboard`);
  logger.log(`⚙️ Admin Control Panel available at: http://localhost:${port}/control-panel`);
  logger.log(`📚 Swagger API Docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
