import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({ description: 'Número identificador da sala física', example: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  numero: number;

  @ApiProperty({ description: 'Capacidade máxima de pessoas nesta sala', example: 100 })
  @IsNumber()
  @Min(1)
  capacidade: number;
}
