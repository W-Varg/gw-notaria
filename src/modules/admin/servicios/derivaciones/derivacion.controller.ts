import { Controller, Get, Post, Patch, Param, Body, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DerivacionService } from './derivacion.service';
import {
  CreateDerivacionDto,
  RechazarDerivacionDto,
  CancelarDerivacionDto,
  MarcarVisualizadaDto,
  ListDerivacionArgsDto,
} from './dto/derivacion.input.dto';
import {
  ResponseDerivacionType,
  ResponseDerivacionDetailType,
  ResponseDerivacionesType,
  PaginateDerivacionesType,
  ResponseDerivacionesStatsType,
} from './dto/derivacion.response';
import { IToken, AuthUser } from '../../../../common/decorators/token.decorator';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../../enums/tipo-accion.enum';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';

@ApiTags('[admin] Derivaciones de Servicios')
@Controller('admin/derivaciones')
@UseInterceptors(AuditInterceptor)
export class DerivacionController {
  constructor(private readonly derivacionService: DerivacionService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.SERVICIOS_CREAR])
  @ApiDescription('Crear una nueva derivación de servicio', [PermisoEnum.SERVICIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'servicios',
    tabla: 'DerivacionServicio',
    descripcion: 'Crear derivación de servicio',
  })
  create(@Body() createDerivacionDto: CreateDerivacionDto, @AuthUser() session: IToken) {
    return this.derivacionService.create(createDerivacionDto, session);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener detalle de una derivación', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionDetailType })
  findOne(@Param() params: CommonParamsDto.IdCuid, @AuthUser() session: IToken) {
    return this.derivacionService.findOne(params.id, session);
  }

  @Get('stats/dashboard')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener estadísticas de derivaciones', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesStatsType })
  getStats(@AuthUser() session: IToken) {
    return this.derivacionService.getStats(session);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Filtrar derivaciones de forma genérica', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateDerivacionesType })
  filter(@Body() inputDto: ListDerivacionArgsDto) {
    return this.derivacionService.filter(inputDto);
  }

  @Post('mis-derivaciones/recibidas')
  @BearerAuthPermision()
  @ApiDescription('Obtener mis derivaciones recibidas')
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesType })
  misDerivacionesRecibidas(@Body() filters: ListDerivacionArgsDto, @AuthUser() session: IToken) {
    return this.derivacionService.misDerivacionesRecibidas(filters, session);
  }

  @Post('cancelar')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiDescription('Cancelar una derivación (solo si no ha sido visualizada)', [
    PermisoEnum.SERVICIOS_EDITAR,
  ])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'servicios',
    tabla: 'DerivacionServicio',
    descripcion: 'Cancelar derivación de servicio',
  })
  cancelar(@Body() cancelarDto: CancelarDerivacionDto, @AuthUser() session: IToken) {
    return this.derivacionService.cancelar(cancelarDto, session);
  }

  @Patch('rechazar')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiDescription('Rechazar una derivación recibida', [PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'servicios',
    tabla: 'DerivacionServicio',
    descripcion: 'Rechazar derivación de servicio',
  })
  rechazar(@Body() rechazarDto: RechazarDerivacionDto, @AuthUser() session: IToken) {
    return this.derivacionService.rechazar(rechazarDto, session);
  }

  @Post('marcar-visualizada')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Marcar una derivación como visualizada', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  marcarVisualizada(@Body() marcarDto: MarcarVisualizadaDto, @AuthUser() session: IToken) {
    return this.derivacionService.marcarVisualizada(marcarDto, session);
  }

  @Get('mis-derivaciones/enviadas')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener mis derivaciones enviadas', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesType })
  findMisDerivacionesEnviadas(@AuthUser() session: IToken) {
    return this.derivacionService.findMisDerivacionesEnviadas(session);
  }

  @Get('historial/:servicioId')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener historial de derivaciones de un servicio', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesType })
  findByServicio(@Param('servicioId') servicioId: string) {
    return this.derivacionService.findByServicio(servicioId);
  }
}
