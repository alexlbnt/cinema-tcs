// src/pedido/pedido.service.ts — substitui o existente

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    ingressoIds: number[];
    snackIds: number[];
    valorTotal: number;
  }) {
    // Valida que todos os ingressos existem
    for (const id of data.ingressoIds) {
      const ingresso = await this.prisma.ingresso.findUnique({ where: { id } });
      if (!ingresso) throw new NotFoundException(`Ingresso ${id} não encontrado`);
    }

    return this.prisma.pedido.create({
      data: {
        valorTotal: data.valorTotal,
        ingressos: {
          connect: data.ingressoIds.map((id) => ({ id })),
        },
        snacks: data.snackIds.length
          ? { connect: data.snackIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        ingressos: {
          include: {
            sessao: {
              include: { filme: true, sala: true },
            },
          },
        },
        snacks: true,
      },
    });
  }

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        ingressos: {
          include: { sessao: { include: { filme: true, sala: true } } },
        },
        snacks: true,
      },
      orderBy: { dataHora: 'desc' },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        ingressos: {
          include: { sessao: { include: { filme: true, sala: true } } },
        },
        snacks: true,
      },
    });
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }
}
