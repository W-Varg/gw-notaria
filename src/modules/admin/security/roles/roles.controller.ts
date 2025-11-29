import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto, ListRoleArgsDto, UpdateRoleDto } from './dto/roles.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateRolesType,
  ResponseRolDetailType,
  ResponseRolType,
  ResponseRolesType,
} from './dto/roles.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[auth] Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.ROLES_CREAR])
  @ApiDescription('Crear un nuevo rol', [PermisoEnum.ROLES_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseRolType })
  create(@Body() inputDto: CreateRolDto) {
    return this.rolesService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.ROLES_VER])
  @ApiDescription('Listar todos los roles', [PermisoEnum.ROLES_VER])
  @ApiResponse({ status: 200, type: () => ResponseRolesType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.ROLES_VER])
  @ApiDescription('servicio post con filtros y paginado de roles', [PermisoEnum.ROLES_VER])
  @ApiResponse({ status: 200, type: () => PaginateRolesType })
  list(@Body() inputDto: ListRoleArgsDto) {
    return this.rolesService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.ROLES_VER])
  @ApiResponse({ status: 200, type: () => ResponseRolDetailType })
  @ApiDescription('Obtener un rol por ID', [PermisoEnum.ROLES_VER])
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.ROLES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseRolType })
  @ApiDescription('Actualizar un rol por ID', [PermisoEnum.ROLES_EDITAR])
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.ROLES_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseRolType })
  @ApiDescription('Eliminar un rol por ID', [PermisoEnum.ROLES_ELIMINAR])
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
