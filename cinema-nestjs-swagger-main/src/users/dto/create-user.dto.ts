import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'joao@email.com', description: 'O email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'senha123', description: 'Senha com no mínimo 6 caracteres', minLength: 6, required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'senha123', description: 'Senha com no mínimo 6 caracteres', minLength: 6, required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;
}
