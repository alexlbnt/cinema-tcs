import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessaoService } from './sessao.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Sessões')
@Controller('sessao')
export class SessaoController {
  constructor(private readonly sessaoService: SessaoService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra uma nova Sessão' })
  create(@Body() createSessaoDto: CreateSessaoDto) {
    return this.sessaoService.create(createSessaoDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todas as sessões disponíveis' })
  findAll() {
    return this.sessaoService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca uma sessão por ID' })
  findOne(@Param('id') id: string) {
    return this.sessaoService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma sessão existente' })
  update(@Param('id') id: string, @Body() updateSessaoDto: UpdateSessaoDto) {
    return this.sessaoService.update(+id, updateSessaoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove uma sessão pelo ID' })
  remove(@Param('id') id: string) {
    return this.sessaoService.remove(+id);
  }
}
