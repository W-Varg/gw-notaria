import { Controller, Get, Post, Body, Query, Patch, Param, UseInterceptors } from '@nestjs/common';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { PermisosService } from './permisos.service';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import { ListPermisosArgsDto, UpdatePermisoActivoDto } from './dto/permisos.dto';
import {
  ResponseMessageType,
  ResponsePermisosType,
  PaginatePermisosType,
  ResponsePermisoDetailType,
} from './dto/permisos.response';
import { ResponseRolDetailType } from '../roles/dto/roles.response';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[auth] Permisos')
@Controller('permisos')
@UseInterceptors(AuditInterceptor)
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post('list')
  @BearerAuthPermision([PermisoEnum.PERMISOS_VER])
  @ApiDescription('Listar permisos con filtros y paginado', [PermisoEnum.PERMISOS_VER])
  @ApiResponse({ status: 200, type: () => PaginatePermisosType })
  list(@Body() inputDto: ListPermisosArgsDto) {
    return this.permisosService.filter(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.PERMISOS_VER])
  @ApiDescription('Listar todos los permisos', [PermisoEnum.PERMISOS_VER])
  @ApiResponse({ status: 200, type: () => ResponsePermisosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.permisosService.findAll(query);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.PERMISOS_VER])
  @ApiDescription('Obtener un permiso por ID', [PermisoEnum.PERMISOS_VER])
  @ApiResponse({ status: 200, type: () => ResponsePermisoDetailType })
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.permisosService.findOne(params.id);
  }

  @Post('asignar')
  @BearerAuthPermision([PermisoEnum.ROLES_EDITAR])
  @ApiDescription('Asignar permisos a un rol', [PermisoEnum.ROLES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseRolDetailType })
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'admin',
    tabla: 'Permiso',
    descripcion: 'Asignación de permisos a rol',
  })
  assign(@Body() body: { roleId: number; permisos: string[] }) {
    return this.permisosService.assignToRoleByNames(body.roleId, body.permisos);
  }

  @Patch(':id/activo')
  @BearerAuthPermision([PermisoEnum.PERMISOS_EDITAR])
  @ApiDescription('Cambiar el estado activo de un permiso', [PermisoEnum.PERMISOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseMessageType })
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'admin',
    tabla: 'Permiso',
    descripcion: 'Cambio de estado activo de permiso',
  })
  updateActivo(
    @Param() params: CommonParamsDto.Id,
    @Body() updateActivoDto: UpdatePermisoActivoDto,
  ) {
    return this.permisosService.updateActivo(params.id, updateActivoDto);
  }
}
