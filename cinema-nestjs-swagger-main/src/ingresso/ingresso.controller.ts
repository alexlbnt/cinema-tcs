import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngressoService } from './ingresso.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { Public } from '../auth/public.decorator';
import { Roles, ADMIN } from '../auth/roles.decorator';

@ApiTags('Ingressos')
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
  @Roles(ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os ingressos (somente ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de ingressos retornada com sucesso.' })
  findAll() {
    return this.ingressoService.findAll();
  }

  @Get(':id')
  @Roles(ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca um ingresso por ID (somente ADMIN)' })
  @ApiResponse({ status: 200, description: 'Ingresso encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ingresso não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingressoService.findOne(id);
  }
}
