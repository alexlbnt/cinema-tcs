import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilmeService } from './filme.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Filmes')
@Controller('filme')
export class FilmeController {
  constructor(private readonly filmeService: FilmeService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra um novo filme' })
  @ApiResponse({ status: 201, description: 'Filme cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createFilmeDto: CreateFilmeDto) {
    return this.filmeService.create(createFilmeDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Filmes em exibição com seus Gêneros' })
  @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso.' })
  findAll() {
    return this.filmeService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca as informações detalhadas de um filme' })
  @ApiResponse({ status: 200, description: 'Filme encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.filmeService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um filme existente' })
  @ApiResponse({ status: 200, description: 'Filme atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  update(@Param('id') id: string, @Body() updateFilmeDto: UpdateFilmeDto) {
    return this.filmeService.update(+id, updateFilmeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um filme pelo ID' })
  @ApiResponse({ status: 200, description: 'Filme removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  remove(@Param('id') id: string) {
    return this.filmeService.remove(+id);
  }
}
