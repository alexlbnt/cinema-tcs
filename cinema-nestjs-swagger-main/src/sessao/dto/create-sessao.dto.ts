import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSessaoDto {
  @ApiProperty({ description: 'ID do Filme que será exibido', example: 1 })
  @IsNumber()
  @Min(1)
  filmeId: number;

  @ApiProperty({ description: 'ID da Sala on ocorrerá a sessão', example: 1 })
  @IsNumber()
  @Min(1)
  salaId: number;

  @ApiProperty({ description: 'Data e Hora de início da sessão (formato ISO 8601)', example: '2023-11-20T19:00:00Z' })
  @IsDateString() // Valida se é uma string que o JavaScript consegue converter para Date
  @IsNotEmpty()
  dataHorario: string;

  @ApiProperty({ description: 'Valor padrão do ingresso (inteira)', example: 30.00 })
  @IsNumber()
  @Min(0)
  valorIngresso: number;
}
