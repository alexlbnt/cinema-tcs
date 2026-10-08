import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalaService } from './sala.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Public } from '../auth/public.decorator';
import { Roles, ADMIN } from '../auth/roles.decorator';

@ApiTags('Salas')
@Roles(ADMIN)
@Controller('sala')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra uma nova Sala de cinema' })
  @ApiResponse({ status: 201, description: 'Sala cadastrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salaService.create(createSalaDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todas as Salas' })
  @ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso.' })
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar dados de uma sala por ID' })
  @ApiResponse({ status: 200, description: 'Sala encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma sala existente' })
  @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salaService.update(id, updateSalaDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove uma sala pelo ID' })
  @ApiResponse({ status: 200, description: 'Sala removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.remove(id);
  }
}
