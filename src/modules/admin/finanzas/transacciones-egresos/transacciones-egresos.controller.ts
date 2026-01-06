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
import { TransaccionesEgresosService } from './transacciones-egresos.service';
import {
  CreateTransaccionesEgresosDto,
  UpdateTransaccionesEgresosDto,
  ListTransaccionesEgresosArgsDto,
} from './dto/transacciones-egresos.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateTransaccionesEgresosType,
  ResponseTransaccionesEgresosType,
  ResponseTransaccionesEgresosDetailType,
  ResponseListTransaccionesEgresosType,
} from './dto/transacciones-egresos.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[admin] Transacciones de Egresos')
@Controller('transacciones-egresos')
@UseInterceptors(AuditInterceptor)
export class TransaccionesEgresosController {
  constructor(private readonly transaccionesEgresosService: TransaccionesEgresosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.TRANSACCIONES_EGRESOS_CREAR])
  @ApiDescription('Registrar una nueva transacción de egreso', [
    PermisoEnum.TRANSACCIONES_EGRESOS_CREAR,
  ])
  @ApiResponse({ status: 200, type: () => ResponseTransaccionesEgresosType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'finanzas',
    tabla: 'TransaccionesEgresos',
    descripcion: 'Registrar nueva transacción de egreso',
  })
  create(@Body() inputDto: CreateTransaccionesEgresosDto) {
    return this.transaccionesEgresosService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.TRANSACCIONES_EGRESOS_VER])
  @ApiDescription('Listar todas las transacciones de egresos', [
    PermisoEnum.TRANSACCIONES_EGRESOS_VER,
  ])
  @ApiResponse({ type: ResponseListTransaccionesEgresosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.transaccionesEgresosService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.TRANSACCIONES_EGRESOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de transacciones de egresos', [
    PermisoEnum.TRANSACCIONES_EGRESOS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateTransaccionesEgresosType })
  list(@Body() inputDto: ListTransaccionesEgresosArgsDto) {
    return this.transaccionesEgresosService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.TRANSACCIONES_EGRESOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseTransaccionesEgresosDetailType })
  @ApiDescription('Obtener una transacción de egreso por ID', [
    PermisoEnum.TRANSACCIONES_EGRESOS_VER,
  ])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.transaccionesEgresosService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.TRANSACCIONES_EGRESOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseTransaccionesEgresosType })
  @ApiDescription('Actualizar una transacción de egreso por ID', [
    PermisoEnum.TRANSACCIONES_EGRESOS_EDITAR,
  ])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'finanzas',
    tabla: 'TransaccionesEgresos',
    descripcion: 'Actualizar transacción de egreso',
  })
  update(@Param() params: CommonParamsDto.Id, @Body() updateDto: UpdateTransaccionesEgresosDto) {
    return this.transaccionesEgresosService.update(params.id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.TRANSACCIONES_EGRESOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseTransaccionesEgresosType })
  @ApiDescription('Eliminar una transacción de egreso por ID', [
    PermisoEnum.TRANSACCIONES_EGRESOS_ELIMINAR,
  ])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'finanzas',
    tabla: 'TransaccionesEgresos',
    descripcion: 'Eliminar transacción de egreso',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.transaccionesEgresosService.remove(params.id);
  }
}
