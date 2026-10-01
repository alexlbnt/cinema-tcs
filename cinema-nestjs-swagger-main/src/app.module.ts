import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FilmeModule } from './filme/filme.module';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { IngressoModule } from './ingresso/ingresso.module';
import { PedidoModule } from './pedido/pedido.module';
import { SnackModule } from './snack/snack.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    FilmeModule,
    SalaModule,
    SessaoModule,
    IngressoModule,
    PedidoModule,
    SnackModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Guard global — protege TODAS as rotas automaticamente
    // Rotas públicas usam @Public() para abrir exceção
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
