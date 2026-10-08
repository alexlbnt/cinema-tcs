import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Seleção segura de campos: NUNCA expõe o hash da senha
  private readonly userSafeSelect = {
    id: true,
    nome: true,
    email: true,
    role: true,
    criadoEm: true,
    atualizadoEm: true,
  };

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('E-mail já cadastrado');

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: await bcrypt.hash(dto.senha, 10),
        role: dto.role ?? 'CLIENTE',
      },
      select: this.userSafeSelect,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({ select: this.userSafeSelect, orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id }, select: this.userSafeSelect });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto, requesterId: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.email && dto.email !== user.email) {
      const taken = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
      if (taken) throw new ConflictException('E-mail já cadastrado');
    }
    if (dto.role && dto.role !== user.role && id === requesterId) {
      throw new BadRequestException('Você não pode alterar o seu próprio papel');
    }

    const data: Record<string, any> = {};
    if (dto.nome) data.nome = dto.nome;
    if (dto.email) data.email = dto.email;
    if (dto.role) data.role = dto.role;
    if (dto.senha) data.senha = await bcrypt.hash(dto.senha, 10);

    return this.prisma.usuario.update({ where: { id }, data, select: this.userSafeSelect });
  }

  async remove(id: number, requesterId: number) {
    if (id === requesterId) throw new BadRequestException('Você não pode remover o seu próprio usuário');
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.prisma.usuario.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso' };
  }
}
