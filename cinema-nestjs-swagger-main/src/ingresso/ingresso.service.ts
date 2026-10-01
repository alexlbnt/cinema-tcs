import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngressoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    sessaoId: number;
    tipo: string;
    valorPago: number;
    assento: string;
    usuarioId?: number;
  }) {
    return this.prisma.ingresso.create({
      data: {
        sessaoId: data.sessaoId,
        tipo: data.tipo,
        valorPago: data.valorPago,
        assento: data.assento,
        usuarioId: data.usuarioId,
      },
      include: {
        sessao: { include: { filme: true, sala: true } },
      },
    });
  }

  // Retorna todos os ingressos (admin) ou só do usuário
  async findAll(usuarioId?: number) {
    return this.prisma.ingresso.findMany({
      where: usuarioId ? { usuarioId } : undefined,
      include: {
        sessao: { include: { filme: true, sala: true } },
        pedido: true,
      },
    });
  }

  async findOne(id: number) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { id },
      include: {
        sessao: { include: { filme: true, sala: true } },
        pedido: true,
      },
    });
    if (!ingresso) throw new NotFoundException('Ingresso não encontrado');
    return ingresso;
  }
}