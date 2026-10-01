import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSnackDto } from './dto/create-snack.dto';

@Injectable()
export class SnackService {
  constructor(private prisma: PrismaService) {}

  async create(createSnackDto: CreateSnackDto) {
    return this.prisma.snack.create({
      data: createSnackDto,
    });
  }

  async findAll() {
    return this.prisma.snack.findMany();
  }

  async findOne(id: number) {
    const snack = await this.prisma.snack.findUnique({ where: { id } });
    if (!snack) throw new NotFoundException('Snack não encontrado');
    return snack;
  }

  async update(id: number, updateSnackDto: any) {
    const snack = await this.prisma.snack.findUnique({ where: { id } });
    if (!snack) throw new NotFoundException('Snack não encontrado');

    return this.prisma.snack.update({
      where: { id },
      data: updateSnackDto,
    });
  }

  async remove(id: number) {
    const snack = await this.prisma.snack.findUnique({ where: { id } });
    if (!snack) throw new NotFoundException('Snack não encontrado');
    return this.prisma.snack.delete({ where: { id } });
  }
}

