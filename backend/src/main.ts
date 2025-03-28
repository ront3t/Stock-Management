import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow frontend communication
  await app.listen(3001);
  console.log('Backend listening on port 3001');
}
bootstrap();
