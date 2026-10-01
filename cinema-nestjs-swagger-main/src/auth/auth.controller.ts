import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { LoginDto, RegisterDto, ForgotPasswordDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Cadastrar novo usuário (público)' })
  @ApiBody({ type: RegisterDto })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.nome, body.email, body.senha);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login e obter JWT (público)' })
  @ApiBody({ type: LoginDto })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.senha);
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Recuperar senha (público)' })
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna dados do usuário autenticado (requer JWT)' })
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.sub);
  }
}
