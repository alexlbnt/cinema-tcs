import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessaoService } from './sessao.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { Public } from '../auth/public.decorator';
import { Roles, ADMIN } from '../auth/roles.decorator';

@ApiTags('Sessões')
@Roles(ADMIN)
@Controller('sessao')
export class SessaoController {
  constructor(private readonly sessaoService: SessaoService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra uma nova Sessão' })
  @ApiResponse({ status: 201, description: 'Sessão cadastrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Horário sobrepõe com outra sessão.' })
  create(@Body() createSessaoDto: CreateSessaoDto) {
    return this.sessaoService.create(createSessaoDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todas as sessões disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de sessões retornada com sucesso.' })
  findAll() {
    return this.sessaoService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca uma sessão por ID' })
  @ApiResponse({ status: 200, description: 'Sessão encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma sessão existente' })
  @ApiResponse({ status: 200, description: 'Sessão atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSessaoDto: UpdateSessaoDto) {
    return this.sessaoService.update(id, updateSessaoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove uma sessão pelo ID' })
  @ApiResponse({ status: 200, description: 'Sessão removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.remove(id);
  }
}
