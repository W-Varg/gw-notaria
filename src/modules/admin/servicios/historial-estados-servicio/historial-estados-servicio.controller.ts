import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { HistorialEstadosServicioService } from './historial-estados-servicio.service';
import {
  CreateHistorialEstadosServicioDto,
  UpdateHistorialEstadosServicioDto,
  ListHistorialEstadosServicioArgsDto,
} from './dto/historial-estados-servicio.input.dto';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateHistorialEstadosServiciosType,
  ResponseHistorialEstadosServicioType,
  ResponseHistorialEstadosServicioDetailType,
  ResponseHistorialEstadosServiciosType,
} from './dto/historial-estados-servicio.response';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../../enums/tipo-accion.enum';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';

@ApiTags('[admin] Historial Estados Servicio')
@Controller('historial-estados-servicio')
@UseInterceptors(AuditInterceptor)
export class HistorialEstadosServicioController {
  constructor(private readonly historialEstadosServicioService: HistorialEstadosServicioService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_CREAR])
  @ApiDescription('Registrar un nuevo cambio de estado en servicio', [
    PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_CREAR,
  ])
  @ApiResponse({ status: 200, type: () => ResponseHistorialEstadosServicioType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'servicios',
    tabla: 'HistorialEstadosServicio',
    descripcion: 'Crear nuevo historial de estado',
  })
  create(@Body() inputDto: CreateHistorialEstadosServicioDto) {
    return this.historialEstadosServicioService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER])
  @ApiDescription('Listar todos los historiales de estados', [
    PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER,
  ])
  @ApiResponse({ status: 200, type: ResponseHistorialEstadosServiciosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.historialEstadosServicioService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER])
  @ApiDescription('Servicio post con filtros y paginado de historiales de estados', [
    PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateHistorialEstadosServiciosType })
  list(@Body() inputDto: ListHistorialEstadosServicioArgsDto) {
    return this.historialEstadosServicioService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER])
  @ApiResponse({ status: 200, type: () => ResponseHistorialEstadosServicioDetailType })
  @ApiDescription('Obtener un historial de estado por ID', [
    PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER,
  ])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.historialEstadosServicioService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseHistorialEstadosServicioType })
  @ApiDescription('Actualizar un historial de estado por ID', [
    PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_EDITAR,
  ])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'servicios',
    tabla: 'HistorialEstadosServicio',
    descripcion: 'Actualizar historial de estado',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdateHistorialEstadosServicioDto,
  ) {
    return this.historialEstadosServicioService.update(params.id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseHistorialEstadosServicioType })
  @ApiDescription('Eliminar un historial de estado por ID', [
    PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_ELIMINAR,
  ])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'servicios',
    tabla: 'HistorialEstadosServicio',
    descripcion: 'Eliminar historial de estado',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.historialEstadosServicioService.remove(params.id);
  }
}
