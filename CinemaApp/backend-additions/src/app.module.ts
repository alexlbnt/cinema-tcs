// src/app.module.ts — substitui o existente
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FilmeModule } from './filme/filme.module';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { IngressoModule } from './ingresso/ingresso.module';
import { PedidoModule } from './pedido/pedido.module';
import { SnackModule } from './snack/snack.module';
import { AuthModule } from './auth/auth.module'; // ← NOVO

@Module({
  imports: [
    PrismaModule,
    FilmeModule,
    SalaModule,
    SessaoModule,
    IngressoModule,
    PedidoModule,
    SnackModule,
    AuthModule, // ← NOVO
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// ─────────────────────────────────────────────────────────────────────────────
// src/main.ts — substitui o existente (adiciona CORS + prefixo global)
// ─────────────────────────────────────────────────────────────────────────────
/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ← CORS para o app mobile conectar
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
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0'); // 0.0.0.0 para aceitar conexões externas (mobile)
  console.log(`🎬 Cinema API rodando em http://0.0.0.0:3000`);
  console.log(`📚 Swagger em http://localhost:3000/api`);
}
bootstrap();
*/
