// src/ingresso/dto/create-ingresso.dto.ts — substitui o existente
// Adiciona o campo 'assento' que o app mobile precisa para mapear o mapa de assentos

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsIn } from 'class-validator';

export class CreateIngressoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  sessaoId: number;

  @ApiProperty({ example: 'Inteira', enum: ['Inteira', 'Meia'] })
  @IsString()
  @IsIn(['Inteira', 'Meia'])
  tipo: string;

  @ApiProperty({ example: 25.00 })
  @IsNumber()
  valorPago: number;

  @ApiProperty({ example: 'B4', description: 'Identificador do assento (ex: A1, B4, H8)' })
  @IsString()
  assento: string;
}
