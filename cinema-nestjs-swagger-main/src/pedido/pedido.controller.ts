import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Public } from '../auth/public.decorator';
import { Roles, ADMIN } from '../auth/roles.decorator';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  @Roles(ADMIN)
  @ApiOperation({ summary: 'Lista todos os pedidos (somente ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso.' })
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  @Roles(ADMIN)
  @ApiOperation({ summary: 'Busca um pedido por ID (somente ADMIN)' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidoService.findOne(id);
  }
}
