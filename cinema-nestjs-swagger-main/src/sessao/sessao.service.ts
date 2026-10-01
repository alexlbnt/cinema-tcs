import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';

@Injectable()
export class SessaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessaoDto: CreateSessaoDto) {
    const filme = await this.prisma.filme.findUnique({ where: { id: createSessaoDto.filmeId } });
    if (!filme) throw new NotFoundException('Filme não existe');

    const sala = await this.prisma.sala.findUnique({ where: { id: createSessaoDto.salaId } });
    if (!sala) throw new NotFoundException('Sala não existe');

    // ==========================================
    // REGRA DE NEGÓCIO: Validação de Horário (Sessão)
    // Impedir a criação de sessões em uma mesma sala cujos horários se sobreponham.
    // ==========================================
    
    // Converte a string de data que chegou do Controller para um objeto Date() JavaScript
    const novoInicio = new Date(createSessaoDto.dataHorario);
    
    // O final da nossa nova sessão é a data de início somada da duração do Filme (em minutos)
    const novoFim = new Date(novoInicio.getTime() + filme.duracao * 60000); 

    // Busca todas as sessões já agendadas para o mesmo dia e sala
    // Nota: Em produção deveríamos filtrar apenas as sessões de hoje para performance
    const sessoesExistentes = await this.prisma.sessao.findMany({
      where: { salaId: sala.id },
      include: { filme: true } // Precisamos do filme para saber a duração de cada sessão existente
    });

    for (const sessao of sessoesExistentes) {
      const inicioExistente = new Date(sessao.dataHorario);
      const fimExistente = new Date(inicioExistente.getTime() + sessao.filme.duracao * 60000);

      // Checa sobreposição clássica de intervalos de tempo: 
      // (InicioA < FimB) E (FimA > InicioB) => Ocorre Colisão
      if (novoInicio < fimExistente && novoFim > inicioExistente) {
        throw new ConflictException('Horário sobrepõe com outra sessão já cadastrada nesta sala.');
      }
    }

    // Se passou pela validação sem lançar erro, pode criar a sessão tranquilamente
    return this.prisma.sessao.create({
      data: createSessaoDto,
      include: {
        filme: true,
        sala: true,
      }
    });
  }

  async findAll() {
    return this.prisma.sessao.findMany({
      include: {
        filme: true,
        sala: true
      }
    });
  }

  async findOne(id: number) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id },
      include: { filme: true, sala: true }
    });
    if (!sessao) throw new NotFoundException('Sessão não encontrada');
    return sessao;
  }

  async update(id: number, updateSessaoDto: any) {
    const sessao = await this.prisma.sessao.findUnique({ where: { id } });
    if (!sessao) throw new NotFoundException('Sessão não encontrada');
    return this.prisma.sessao.update({
      where: { id },
      data: updateSessaoDto,
    });
  }

  async remove(id: number) {
    const sessao = await this.prisma.sessao.findUnique({ where: { id } });
    if (!sessao) throw new NotFoundException('Sessão não encontrada');
    return this.prisma.sessao.delete({ where: { id } });
  }
}

