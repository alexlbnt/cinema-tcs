import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  create(@Body() createSnackDto: CreateSnackDto) {
    return this.snackService.create(createSnackDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todos os Snacks' })
  findAll() {
    return this.snackService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca um snack por ID' })
  findOne(@Param('id') id: string) {
    return this.snackService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um snack existente' })
  update(@Param('id') id: string, @Body() updateSnackDto: UpdateSnackDto) {
    return this.snackService.update(+id, updateSnackDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um snack pelo ID' })
  remove(@Param('id') id: string) {
    return this.snackService.remove(+id);
  }
}
