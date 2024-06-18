import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['*'],
    credentials: true,
  });
  const port = process.env.PORT || 4000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    Logger.log('Application is running on: http://localhost:' + port);
  });
}
bootstrap();
