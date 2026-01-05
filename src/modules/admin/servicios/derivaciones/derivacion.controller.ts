import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DerivacionService } from './derivacion.service';
import {
  CreateDerivacionDto,
  AceptarDerivacionDto,
  RechazarDerivacionDto,
  ListDerivacionArgsDto,
} from './dto/derivacion.input.dto';
import {
  ResponseDerivacionType,
  ResponseDerivacionDetailType,
  ResponseDerivacionesType,
  PaginateDerivacionesType,
} from './dto/derivacion.response';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken, AuthUser } from 'src/common/decorators/token.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

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

  @Post('list')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription(
    'Listar derivaciones con filtros avanzados: por funcionario, rango de fechas, trámite, paginado',
    [PermisoEnum.SERVICIOS_VER],
  )
  @ApiResponse({ status: 200, type: () => PaginateDerivacionesType })
  filter(@Body() inputDto: ListDerivacionArgsDto, @AuthUser() session: IToken) {
    return this.derivacionService.filter(inputDto, session);
  }

  @Get('mis-derivaciones/pendientes')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener mis derivaciones pendientes de aceptar', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesType })
  findMisDerivacionesPendientes(@AuthUser() session: IToken) {
    return this.derivacionService.findMisDerivacionesPendientes(session);
  }

  @Get('mis-derivaciones/enviadas')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener mis derivaciones enviadas', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesType })
  findMisDerivacionesEnviadas(@AuthUser() session: IToken) {
    return this.derivacionService.findMisDerivacionesEnviadas(session);
  }

  @Get('servicio/:servicioId')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener historial de derivaciones de un servicio', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionesType })
  findByServicio(@Param('servicioId') servicioId: string) {
    return this.derivacionService.findByServicio(servicioId);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener una derivación por ID', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionDetailType })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.derivacionService.findOne(id);
  }

  @Patch(':id/aceptar')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiDescription('Aceptar una derivación recibida', [PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'servicios',
    tabla: 'DerivacionServicio',
    descripcion: 'Aceptar derivación de servicio',
  })
  aceptar(
    @Param('id', ParseIntPipe) id: number,
    @Body() aceptarDto: AceptarDerivacionDto,
    @AuthUser() session: IToken,
  ) {
    return this.derivacionService.aceptar(id, aceptarDto, session);
  }

  @Patch(':id/rechazar')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiDescription('Rechazar una derivación recibida', [PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'servicios',
    tabla: 'DerivacionServicio',
    descripcion: 'Rechazar derivación de servicio',
  })
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() rechazarDto: RechazarDerivacionDto,
    @AuthUser() session: IToken,
  ) {
    return this.derivacionService.rechazar(id, rechazarDto, session);
  }
}
