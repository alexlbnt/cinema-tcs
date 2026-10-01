// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Registro ───────────────────────────────────────────────────────────────
  async register(nome: string, email: string, senha: string) {
    const exists = await this.prisma.usuario.findUnique({ where: { email } });
    if (exists) throw new ConflictException('E-mail já cadastrado');

    const hash = await bcrypt.hash(senha, 10);
    const user = await this.prisma.usuario.create({
      data: { nome, email, senha: hash },
    });

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, nome: user.nome, email: user.email },
    };
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, nome: user.nome, email: user.email },
    };
  }

  // ─── Recuperar Senha ─────────────────────────────────────────────────────────
  async forgotPassword(email: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    // Não revelamos se o e-mail existe ou não (segurança)
    if (!user) return { message: 'Se este e-mail existir, você receberá um link.' };

    // Em produção: gerar token único, salvar no banco com expiração, enviar via nodemailer
    // Por ora retorna mock
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'reset' },
      { expiresIn: '1h' },
    );
    console.log(`[RESET TOKEN] ${email}: ${resetToken}`); // substituir por envio de e-mail
    return { message: 'Se este e-mail existir, você receberá um link.' };
  }

  // ─── Me (perfil autenticado) ─────────────────────────────────────────────────
  async getMe(userId: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return { id: user.id, nome: user.nome, email: user.email };
  }
}
