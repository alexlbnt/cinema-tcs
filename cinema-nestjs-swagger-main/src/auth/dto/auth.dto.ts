import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@cinema.com', description: 'E-mail do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  senha: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  senha: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail para recuperação' })
  @IsEmail()
  email: string;
}
