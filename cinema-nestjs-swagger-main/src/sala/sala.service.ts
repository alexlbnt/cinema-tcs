import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';

@Injectable()
export class SalaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSalaDto: CreateSalaDto) {
    // Garante que o número da sala é único antes de tentar salvar
    const salaExistente = await this.prisma.sala.findUnique({
      where: { numero: createSalaDto.numero },
    });

    if (salaExistente) {
      throw new ConflictException(`A Sala número ${createSalaDto.numero} já existe.`);
    }

    return this.prisma.sala.create({
      data: createSalaDto,
    });
  }

  async findAll() {
    return this.prisma.sala.findMany();
  }

  async findOne(id: number) {
    const sala = await this.prisma.sala.findUnique({ where: { id } });
    if (!sala) throw new NotFoundException('Sala não encontrada.');
    return sala;
  }

  async update(id: number, updateSalaDto: any) {
    const sala = await this.prisma.sala.findUnique({ where: { id } });
    if (!sala) throw new NotFoundException('Sala não encontrada.');

    return this.prisma.sala.update({
      where: { id },
      data: updateSalaDto,
    });
  }

  async remove(id: number) {
    const sala = await this.prisma.sala.findUnique({ where: { id } });
    if (!sala) throw new NotFoundException('Sala não encontrada.');
    return this.prisma.sala.delete({ where: { id } });
  }
}

