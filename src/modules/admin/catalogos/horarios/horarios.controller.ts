import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { CreateHorarioDto, UpdateHorarioDto, ListHorarioArgsDto } from './dto/horarios.input.dto';
import {
  PaginateHorariosType,
  ResponseHorarioType,
  ResponseHorariosType,
} from './dto/horarios.response';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] Horarios')
@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.HORARIOS_CREAR])
  @ApiDescription('Crear un nuevo horario de atención', [PermisoEnum.HORARIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseHorarioType })
  create(@Body() inputDto: CreateHorarioDto) {
    return this.horariosService.create(inputDto);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.HORARIOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de horarios', [PermisoEnum.HORARIOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateHorariosType })
  list(@Body() inputDto: ListHorarioArgsDto) {
    return this.horariosService.filter(inputDto);
  }

  @Get('sucursal/:sucursalId')
  @BearerAuthPermision([PermisoEnum.HORARIOS_VER])
  @ApiDescription('Listar horarios por sucursal', [PermisoEnum.HORARIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseHorariosType })
  listBySucursal(@Param('sucursalId') sucursalId: string) {
    return this.horariosService.filter({ sucursalId } as any);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.HORARIOS_VER])
  @ApiDescription('Listar todos los horarios', [PermisoEnum.HORARIOS_VER])
  @ApiResponse({ type: ResponseHorariosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.horariosService.findAll(query);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.HORARIOS_VER])
  @ApiDescription('Obtener un horario por ID', [PermisoEnum.HORARIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseHorarioType })
  findOne(@Param('id') id: string) {
    return this.horariosService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.HORARIOS_EDITAR])
  @ApiDescription('Actualizar un horario por ID', [PermisoEnum.HORARIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseHorarioType })
  update(@Param('id') id: string, @Body() updateDto: UpdateHorarioDto) {
    return this.horariosService.update(id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.HORARIOS_ELIMINAR])
  @ApiDescription('Eliminar un horario por ID', [PermisoEnum.HORARIOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseHorarioType })
  remove(@Param('id') id: string) {
    return this.horariosService.remove(id);
  }
}
