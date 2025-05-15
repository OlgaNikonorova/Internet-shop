import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import { createAsyncApiDocs } from '@infrastructure/config/create-async-api-docs';
import { createOpenApiDocs } from '@infrastructure/config/create-open-api-docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.enableCors();

  app
    .useWebSocketAdapter(new WsAdapter(app))
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    .useGlobalFilters(new HttpExceptionFilter())
    .setGlobalPrefix(globalPrefix);

  createOpenApiDocs(app);
  await createAsyncApiDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
