import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePedidoDto) {
    return this.prisma.$transaction(async (tx) => {
      const ingressoIds: number[] = data.ingressoIds ? [...data.ingressoIds] : [];

      // Suporte a ingressos enviados inline
      if (data.sessaoId && data.ingressos?.length) {
        const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        let assentoIdx = 0;
        for (const ing of data.ingressos) {
          const row = letras[Math.floor(assentoIdx / 8)] || 'A';
          const col = (assentoIdx % 8) + 1;
          const assento = ing.assento || `${row}${col}`;
          assentoIdx++;
          const created = await tx.ingresso.create({
            data: {
              sessaoId: data.sessaoId,
              tipo: ing.tipo,
              valorPago: ing.valorPago,
              assento,
              usuarioId: data.usuarioId,
            },
          });
          ingressoIds.push(created.id);
        }
      }

      const snackIds: number[] = data.snackIds ? [...data.snackIds] : [];
      if (data.snacks?.length && snackIds.length === 0) {
        for (const s of data.snacks) {
          for (let i = 0; i < (s.quantidade || 1); i++) {
            snackIds.push(s.snackId);
          }
        }
      }

      return tx.pedido.create({
        data: {
          valorTotal: data.valorTotal,
          usuarioId: data.usuarioId,
          ingressos: ingressoIds.length
            ? { connect: ingressoIds.map((id) => ({ id })) }
            : undefined,
          snacks: snackIds.length
            ? { connect: snackIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          ingressos: {
            include: { sessao: { include: { filme: true, sala: true } } },
          },
          snacks: true,
        },
      });
    });
  }

  async findAll(usuarioId?: number) {
    return this.prisma.pedido.findMany({
      where: usuarioId ? { usuarioId } : undefined,
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