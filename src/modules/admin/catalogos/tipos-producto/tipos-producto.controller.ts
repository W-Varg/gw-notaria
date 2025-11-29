import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TiposProductoService } from './tipos-producto.service';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import {
  CreateTipoProductoDto,
  UpdateTipoProductoDto,
  ListTipoProductoArgsDto,
} from './dto/tipos-producto.input.dto';
import {
  PaginateTiposProductoType,
  ResponseTipoProductoType,
  ResponseTipoProductoDetailType,
  ResponseTiposProductoType,
} from './dto/tipos-producto.response';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] Tipos de Producto')
@Controller('tipos-producto')
export class TiposProductoController {
  constructor(private readonly tiposProductoService: TiposProductoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.TIPOS_PRODUCTO_CREAR])
  @ApiDescription('Crear un nuevo tipo de producto', [PermisoEnum.TIPOS_PRODUCTO_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoProductoType })
  create(@Body() inputDto: CreateTipoProductoDto) {
    return this.tiposProductoService.create(inputDto);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.TIPOS_PRODUCTO_VER])
  @ApiDescription('Servicio post con filtros y paginado de tipos de producto', [
    PermisoEnum.TIPOS_PRODUCTO_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateTiposProductoType })
  list(@Body() inputDto: ListTipoProductoArgsDto) {
    return this.tiposProductoService.filter(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.TIPOS_PRODUCTO_VER])
  @ApiDescription('Listar todos los tipos de producto', [PermisoEnum.TIPOS_PRODUCTO_VER])
  @ApiResponse({ type: ResponseTiposProductoType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.tiposProductoService.findAll(query);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_PRODUCTO_VER])
  @ApiDescription('Obtener un tipo de producto por ID', [PermisoEnum.TIPOS_PRODUCTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseTipoProductoType })
  findOne(@Param('id') id: string) {
    return this.tiposProductoService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_PRODUCTO_EDITAR])
  @ApiDescription('Actualizar un tipo de producto por ID', [PermisoEnum.TIPOS_PRODUCTO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoProductoType })
  update(@Param('id') id: string, @Body() updateDto: UpdateTipoProductoDto) {
    return this.tiposProductoService.update(id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_PRODUCTO_ELIMINAR])
  @ApiDescription('Eliminar un tipo de producto por ID', [PermisoEnum.TIPOS_PRODUCTO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoProductoType })
  remove(@Param('id') id: string) {
    return this.tiposProductoService.remove(id);
  }
}
