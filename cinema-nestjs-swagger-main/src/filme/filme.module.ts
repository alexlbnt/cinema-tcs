import { Module } from '@nestjs/common';
import { FilmeController } from './filme.controller';
import { FilmeService } from './filme.service';

@Module({
  controllers: [FilmeController],
  providers: [FilmeService]
})
export class FilmeModule {}
