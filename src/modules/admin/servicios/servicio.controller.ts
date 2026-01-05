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
  ParseIntPipe,
} from '@nestjs/common';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { ServicioService } from './servicio.service';
import {
  CreateServicioDto,
  UpdateServicioDto,
  ListServicioArgsDto,
} from './dto/servicio.input.dto';
import {
  ServiciosDashboardFilterDto,
  UpdateServicioProgresoDto,
  RegistrarPagoServicioDto,
} from './dto/servicio.input-extended.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateServiciosType,
  ResponseServicioType,
  ResponseServicioDetailType,
  ResponseServiciosType,
  ResponseServiciosStatsType,
} from './dto/servicio.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

@ApiTags('[admin] Servicios')
@Controller('servicios')
@UseInterceptors(AuditInterceptor)
export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.SERVICIOS_CREAR])
  @ApiDescription('Crear un nuevo servicio', [PermisoEnum.SERVICIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseServicioType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'servicios',
    tabla: 'Servicio',
    descripcion: 'Crear nuevo servicio',
  })
  create(@Body() inputDto: CreateServicioDto, @AuthUser() session: IToken) {
    return this.servicioService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Listar todos los servicios', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ type: ResponseServiciosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.servicioService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de servicios', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateServiciosType })
  list(@Body() inputDto: ListServicioArgsDto) {
    return this.servicioService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseServicioDetailType })
  @ApiDescription('Obtener un servicio por ID', [PermisoEnum.SERVICIOS_VER])
  findOne(@Param('id') id: string) {
    return this.servicioService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseServicioType })
  @ApiDescription('Actualizar un servicio por ID', [PermisoEnum.SERVICIOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'servicios',
    tabla: 'Servicio',
    descripcion: 'Actualizar servicio',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServicioDto,
    @AuthUser() session: IToken,
  ) {
    return this.servicioService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseServicioType })
  @ApiDescription('Eliminar un servicio por ID', [PermisoEnum.SERVICIOS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'servicios',
    tabla: 'Servicio',
    descripcion: 'Eliminar servicio',
  })
  remove(@Param('id') id: string) {
    return this.servicioService.remove(id);
  }

  @Get('stats/dashboard')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener estadísticas del dashboard', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseServiciosStatsType })
  getStats() {
    return this.servicioService.getStats();
  }

  @Post('dashboard/list')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Listar servicios para el dashboard con filtros', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateServiciosType })
  findAllDashboard(@Body() filters: ServiciosDashboardFilterDto) {
    return this.servicioService.findAllDashboard(filters);
  }

  @Patch(':id/progreso')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseServicioType })
  @ApiDescription('Actualizar el estado/progreso de un servicio', [PermisoEnum.SERVICIOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'servicios',
    tabla: 'Servicio',
    descripcion: 'Actualizar progreso de servicio',
  })
  updateProgreso(
    @Param('id') id: string,
    @Body() dto: UpdateServicioProgresoDto,
    @AuthUser() session: IToken,
  ) {
    return this.servicioService.updateProgreso(id, dto, session.usuarioId);
  }

  @Post(':id/pagos')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseServicioType })
  @ApiDescription('Registrar un pago para un servicio', [PermisoEnum.SERVICIOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'servicios',
    tabla: 'PagosIngresos',
    descripcion: 'Registrar pago de servicio',
  })
  registrarPago(
    @Param('id') id: string,
    @Body() dto: RegistrarPagoServicioDto,
    @AuthUser() session: IToken,
  ) {
    return this.servicioService.registrarPago(id, dto, session.usuarioId);
  }
}
