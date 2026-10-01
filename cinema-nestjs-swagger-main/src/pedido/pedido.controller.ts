import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PedidoService } from './pedido.service';
import { Public } from '../auth/public.decorator';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Cria um novo pedido (requer JWT)' })
  create(@Body() body: any) {
    return this.pedidoService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos (requer JWT)' })
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pedido por ID (requer JWT)' })
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }
}
