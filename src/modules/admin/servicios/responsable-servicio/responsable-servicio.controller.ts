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
import { ResponsableServicioService } from './responsable-servicio.service';
import {
  CreateResponsableServicioDto,
  UpdateResponsableServicioDto,
  ListResponsableServicioArgsDto,
} from './dto/responsable-servicio.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateResponsablesServicioType,
  ResponseResponsableServicioType,
  ResponseResponsableServicioDetailType,
  ResponseResponsablesServicioType,
} from './dto/responsable-servicio.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/generated/prisma/enums';

@ApiTags('[admin] Responsables de Servicio')
@Controller('responsables-servicio')
@UseInterceptors(AuditInterceptor)
export class ResponsableServicioController {
  constructor(private readonly responsableServicioService: ResponsableServicioService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.RESPONSABLES_SERVICIO_CREAR])
  @ApiDescription('Asignar un responsable a un servicio', [
    PermisoEnum.RESPONSABLES_SERVICIO_CREAR,
  ])
  @ApiResponse({ status: 200, type: () => ResponseResponsableServicioType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'servicios',
    tabla: 'ResponsableServicio',
    descripcion: 'Asignar responsable a servicio',
  })
  create(@Body() inputDto: CreateResponsableServicioDto) {
    return this.responsableServicioService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.RESPONSABLES_SERVICIO_VER])
  @ApiDescription('Listar todos los responsables de servicios', [
    PermisoEnum.RESPONSABLES_SERVICIO_VER,
  ])
  @ApiResponse({ type: ResponseResponsablesServicioType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.responsableServicioService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.RESPONSABLES_SERVICIO_VER])
  @ApiDescription('Servicio post con filtros y paginado de responsables de servicios', [
    PermisoEnum.RESPONSABLES_SERVICIO_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateResponsablesServicioType })
  list(@Body() inputDto: ListResponsableServicioArgsDto) {
    return this.responsableServicioService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.RESPONSABLES_SERVICIO_VER])
  @ApiResponse({ status: 200, type: () => ResponseResponsableServicioDetailType })
  @ApiDescription('Obtener un responsable de servicio por ID', [
    PermisoEnum.RESPONSABLES_SERVICIO_VER,
  ])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.responsableServicioService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.RESPONSABLES_SERVICIO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseResponsableServicioType })
  @ApiDescription('Actualizar un responsable de servicio por ID', [
    PermisoEnum.RESPONSABLES_SERVICIO_EDITAR,
  ])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'servicios',
    tabla: 'ResponsableServicio',
    descripcion: 'Actualizar responsable de servicio',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateResponsableServicioDto,
  ) {
    return this.responsableServicioService.update(id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.RESPONSABLES_SERVICIO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseResponsableServicioType })
  @ApiDescription('Eliminar un responsable de servicio por ID', [
    PermisoEnum.RESPONSABLES_SERVICIO_ELIMINAR,
  ])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'servicios',
    tabla: 'ResponsableServicio',
    descripcion: 'Eliminar responsable de servicio',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.responsableServicioService.remove(id);
  }
}
