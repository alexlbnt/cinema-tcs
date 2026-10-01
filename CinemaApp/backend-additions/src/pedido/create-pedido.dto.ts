// src/pedido/dto/create-pedido.dto.ts — substitui o existente

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, ArrayMinSize } from 'class-validator';

export class CreatePedidoDto {
  @ApiProperty({ example: [1, 2], description: 'IDs dos ingressos já criados' })
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  ingressoIds: number[];

  @ApiProperty({ example: [1, 3], description: 'IDs dos snacks (pode ser vazio)' })
  @IsArray()
  @IsInt({ each: true })
  snackIds: number[];

  @ApiProperty({ example: 75.00 })
  @IsNumber()
  valorTotal: number;
}
