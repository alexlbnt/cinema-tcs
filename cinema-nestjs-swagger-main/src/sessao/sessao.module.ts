import { Module } from '@nestjs/common';
import { SessaoController } from './sessao.controller';
import { SessaoService } from './sessao.service';

@Module({
  controllers: [SessaoController],
  providers: [SessaoService]
})
export class SessaoModule {}
