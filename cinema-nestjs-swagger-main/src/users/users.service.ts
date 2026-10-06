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
    criadoEm: true,
    atualizadoEm: true,
  };

  async create(createUserDto: CreateUserDto) {
    const nome = createUserDto.nome || createUserDto.name;
    const email = createUserDto.email;
    const senha = createUserDto.senha || createUserDto.password;

    if (!nome) {
      throw new BadRequestException('O campo nome é obrigatório');
    }
    if (!senha) {
      throw new BadRequestException('O campo senha é obrigatório');
    }

    const exists = await this.prisma.usuario.findUnique({ where: { email } });
    if (exists) throw new ConflictException('E-mail já cadastrado');

    const hashedPassword = await bcrypt.hash(senha, 10);
    return this.prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
      select: this.userSafeSelect,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: this.userSafeSelect,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.userSafeSelect,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const data: any = {};
    if (updateUserDto.nome || updateUserDto.name) {
      data.nome = updateUserDto.nome || updateUserDto.name;
    }
    if (updateUserDto.email) {
      data.email = updateUserDto.email;
    }
    const senha = updateUserDto.senha || updateUserDto.password;
    if (senha) {
      data.senha = await bcrypt.hash(senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
      select: this.userSafeSelect,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.prisma.usuario.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso' };
  }
}
