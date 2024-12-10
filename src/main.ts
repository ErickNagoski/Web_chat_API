import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Refresh, Authorization',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
    credentials: true,
    origin: [
      '*',
      'http://localhost:5173'
    ],
  });
  await app.listen(3000);
}
bootstrap();
