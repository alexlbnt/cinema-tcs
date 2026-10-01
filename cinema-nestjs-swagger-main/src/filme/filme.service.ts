import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmeDto } from './dto/create-filme.dto';

@Injectable()
export class FilmeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFilmeDto: CreateFilmeDto) {
    return this.prisma.filme.create({
      data: createFilmeDto,
    });
  }

  async findAll() {
    return this.prisma.filme.findMany();
  }

  async findOne(id: number) {
    const filme = await this.prisma.filme.findUnique({ 
      where: { id }
    });
    
    if (!filme) throw new NotFoundException('Filme não encontrado');
    return filme;
  }

  async update(id: number, updateFilmeDto: any) {
    const filme = await this.prisma.filme.findUnique({ where: { id } });
    if (!filme) throw new NotFoundException('Filme não encontrado');

    return this.prisma.filme.update({
      where: { id },
      data: updateFilmeDto,
    });
  }

  async remove(id: number) {
    const filme = await this.prisma.filme.findUnique({ where: { id } });
    if (!filme) throw new NotFoundException('Filme não encontrado');
    return this.prisma.filme.delete({ where: { id } });
  }
}
