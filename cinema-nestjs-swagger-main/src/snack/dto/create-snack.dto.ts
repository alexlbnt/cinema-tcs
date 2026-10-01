import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSnackDto {
  @ApiProperty({ description: 'Nome do snack', example: 'Pipoca Grande' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Preço do snack', example: 15.5 })
  @IsNumber()
  @Min(0)
  preco: number;
}
