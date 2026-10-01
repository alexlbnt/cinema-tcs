import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngressoService } from './ingresso.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Ingressos')
@ApiBearerAuth()
@Controller('ingresso')
export class IngressoController {
  constructor(private readonly ingressoService: IngressoService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Cria um novo ingresso' })
  @ApiResponse({ status: 201, description: 'Ingresso criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createIngressoDto: CreateIngressoDto) {
    return this.ingressoService.create(createIngressoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os ingressos (requer JWT)' })
  @ApiResponse({ status: 200, description: 'Lista de ingressos retornada com sucesso.' })
  findAll() {
    return this.ingressoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um ingresso por ID (requer JWT)' })
  @ApiResponse({ status: 200, description: 'Ingresso encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ingresso não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.ingressoService.findOne(+id);
  }
}
