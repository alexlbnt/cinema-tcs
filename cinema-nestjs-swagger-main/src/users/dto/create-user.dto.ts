import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export const ROLES_VALIDOS = ['ADMIN', 'CLIENTE'];

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Admin', description: 'Nome completo' })
  @IsString()
  @MinLength(2)
  nome: string;

  @ApiProperty({ example: 'maria@cinema.com', description: 'E-mail (único)' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha com no mínimo 6 caracteres', minLength: 6 })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiPropertyOptional({ enum: ROLES_VALIDOS, default: 'CLIENTE', description: 'Use ADMIN para criar um administrador' })
  @IsOptional()
  @IsIn(ROLES_VALIDOS)
  role?: string;
}
