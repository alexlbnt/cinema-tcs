import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsIn, IsOptional } from 'class-validator';

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

  @ApiProperty({ example: 'B4' })
  @IsString()
  assento: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  usuarioId?: number;
}