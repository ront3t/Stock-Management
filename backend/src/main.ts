import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = process.env.port || 3000;
  app.enableCors(); // Allow frontend communication
  await app.listen(port);
  console.log('Backend listening on port 3000');
}
bootstrap();
