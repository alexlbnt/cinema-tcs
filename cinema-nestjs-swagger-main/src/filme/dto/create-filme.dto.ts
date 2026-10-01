import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateFilmeDto {
  @ApiProperty({ description: 'Título do filme', example: 'Vingadores: Ultimato' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ description: 'Gênero do filme', example: 'Ação' })
  @IsString()
  @IsNotEmpty()
  genero: string;

  @ApiProperty({ description: 'Duração do filme em minutos', example: 181 })
  @IsNumber()
  @Min(1)
  duracao: number;

  @ApiProperty({ description: 'Classificação etária (0 significa livre)', example: 12 })
  @IsNumber()
  @Min(0)
  classificacaoEtaria: number;
}
