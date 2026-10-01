import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SnackService } from './snack.service';
import { CreateSnackDto } from './dto/create-snack.dto';
import { UpdateSnackDto } from './dto/update-snack.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Snacks')
@Controller('snack')
export class SnackController {
  constructor(private readonly snackService: SnackService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra um novo Snack' })
  @ApiResponse({ status: 201, description: 'Snack cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createSnackDto: CreateSnackDto) {
    return this.snackService.create(createSnackDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todos os Snacks' })
  @ApiResponse({ status: 200, description: 'Lista de snacks retornada com sucesso.' })
  findAll() {
    return this.snackService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca um snack por ID' })
  @ApiResponse({ status: 200, description: 'Snack encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Snack não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.snackService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um snack existente' })
  @ApiResponse({ status: 200, description: 'Snack atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Snack não encontrado.' })
  update(@Param('id') id: string, @Body() updateSnackDto: UpdateSnackDto) {
    return this.snackService.update(+id, updateSnackDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um snack pelo ID' })
  @ApiResponse({ status: 200, description: 'Snack removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Snack não encontrado.' })
  remove(@Param('id') id: string) {
    return this.snackService.remove(+id);
  }
}
