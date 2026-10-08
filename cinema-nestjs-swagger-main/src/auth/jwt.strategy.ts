import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'cinema-secret-key',
    });
  }

  // O papel é lido do banco a cada requisição: rebaixar/remover um admin vale na hora
  async validate(payload: { sub: number; email: string; type?: string }) {
    if (payload.type === 'reset') throw new UnauthorizedException('Token inválido');
    const user = await this.prisma.usuario.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('Usuário não existe mais');
    return { sub: user.id, email: user.email, role: user.role };
  }
}
