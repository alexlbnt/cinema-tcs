import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalaService } from './sala.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Salas')
@Controller('sala')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra uma nova Sala de cinema' })
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salaService.create(createSalaDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todas as Salas' })
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar dados de uma sala por ID' })
  findOne(@Param('id') id: string) {
    return this.salaService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma sala existente' })
  update(@Param('id') id: string, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salaService.update(+id, updateSalaDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove uma sala pelo ID' })
  remove(@Param('id') id: string) {
    return this.salaService.remove(+id);
  }
}
