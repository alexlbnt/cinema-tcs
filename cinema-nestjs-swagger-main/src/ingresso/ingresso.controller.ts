import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Cria um novo ingresso ' })
  create(@Body() createIngressoDto: CreateIngressoDto) {
    return this.ingressoService.create(createIngressoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os ingressos (requer JWT)' })
  findAll() {
    return this.ingressoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um ingresso por ID (requer JWT)' })
  findOne(@Param('id') id: string) {
    return this.ingressoService.findOne(+id);
  }
}
