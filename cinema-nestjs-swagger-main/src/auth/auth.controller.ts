import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginDto, RegisterDto, ForgotPasswordDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Cadastrar novo usuário (público)' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  @ApiBody({ type: RegisterDto })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.nome, body.email, body.senha);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login e obter JWT (público)' })
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiBody({ type: LoginDto })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.senha);
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Recuperar senha (público)' })
  @ApiResponse({ status: 200, description: 'Instrução de recuperação processada.' })
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna dados do usuário autenticado (requer JWT)' })
  @ApiResponse({ status: 200, description: 'Dados do perfil do usuário autenticado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.sub);
  }
}
