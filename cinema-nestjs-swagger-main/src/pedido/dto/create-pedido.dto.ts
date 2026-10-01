import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Ingressos para criação inline' })
  @IsOptional()
  @IsArray()
  ingressos?: Array<{ tipo: string; valorPago: number; assento: string }>;

  @ApiPropertyOptional({ description: 'Snacks para criação inline com quantidade' })
  @IsOptional()
  @IsArray()
  snacks?: Array<{ snackId: number; quantidade: number }>;
}
