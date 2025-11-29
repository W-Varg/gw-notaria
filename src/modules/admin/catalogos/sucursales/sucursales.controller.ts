import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import {
  CreateSucursalDto,
  UpdateSucursalDto,
  ListSucursalArgsDto,
} from './dto/sucursales.input.dto';
import {
  PaginateSucursalesType,
  ResponseSucursalType,
  ResponseSucursalesType,
} from './dto/sucursales.response';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] Sucursales')
@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.SUCURSALES_CREAR])
  @ApiDescription('Crear una nueva sucursal', [PermisoEnum.SUCURSALES_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  create(@Body() inputDto: CreateSucursalDto) {
    return this.sucursalesService.create(inputDto);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
  @ApiDescription('servicio post con filtros y paginado de sucursales', [
    PermisoEnum.SUCURSALES_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateSucursalesType })
  list(@Body() inputDto: ListSucursalArgsDto) {
    return this.sucursalesService.filter(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
  @ApiDescription('Listar todas las sucursales', [PermisoEnum.SUCURSALES_VER])
  @ApiResponse({ status: 200, type: () => ResponseSucursalesType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.sucursalesService.findAll(query);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
  @ApiDescription('Obtener una sucursal por ID', [PermisoEnum.SUCURSALES_VER])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  findOne(@Param('id') id: string) {
    return this.sucursalesService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_EDITAR])
  @ApiDescription('Actualizar una sucursal por ID', [PermisoEnum.SUCURSALES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  update(@Param('id') id: string, @Body() updateDto: UpdateSucursalDto) {
    return this.sucursalesService.update(id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_ELIMINAR])
  @ApiDescription('Eliminar una sucursal por ID', [PermisoEnum.SUCURSALES_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  remove(@Param('id') id: string) {
    return this.sucursalesService.remove(id);
  }
}
