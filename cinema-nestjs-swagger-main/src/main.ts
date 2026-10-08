import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS habilitado para requisições do frontend web
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validação global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription('API do sistema de cinema com autenticação JWT')
    .setVersion('2.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🎬 Cinema API rodando em http://0.0.0.0:${port}`);
  console.log(`📚 Swagger em http://localhost:${port}/api`);
}
bootstrap();
