import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class PedidoIngressoDto {
  @ApiProperty({ example: 'Inteira', enum: ['Inteira', 'Meia'] })
  @IsIn(['Inteira', 'Meia'])
  tipo: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  valorPago: number;

  @ApiProperty({ example: 'B4' })
  @IsString()
  assento: string;
}

export class PedidoSnackDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  snackId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CreatePedidoDto {
  @ApiPropertyOptional({ example: [1, 2], description: 'IDs dos ingressos já cadastrados' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  ingressoIds?: number[];

  @ApiPropertyOptional({ example: [1, 3], description: 'IDs dos snacks selecionados' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  snackIds?: number[];

  @ApiProperty({ example: 75.00, description: 'Valor total do pedido' })
  @IsNumber()
  @Min(0)
  valorTotal: number;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário associado (opcional)' })
  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID da sessão (para compra direta)' })
  @IsOptional()
  @IsInt()
  sessaoId?: number;

  @ApiPropertyOptional({ type: [PedidoIngressoDto], description: 'Ingressos para criação inline (requer sessaoId)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoIngressoDto)
  ingressos?: PedidoIngressoDto[];

  @ApiPropertyOptional({ type: [PedidoSnackDto], description: 'Snacks para criação inline com quantidade' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoSnackDto)
  snacks?: PedidoSnackDto[];
}
