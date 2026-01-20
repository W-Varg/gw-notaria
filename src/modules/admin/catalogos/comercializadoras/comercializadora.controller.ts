import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ComercializadoraService } from './comercializadora.service';
import {
  CreateComercializadoraDto,
  UpdateComercializadoraDto,
} from './dto/comercializadora.input.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthUser, IToken } from '../../../../common/decorators/token.decorator';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { TipoAccionEnum } from '../../../../enums';
import {
  ResponseComercializadoraType,
  ResponseComercializadoraDetailType,
  ResponseComercializadorasType,
  PaginateComercializadorasType,
} from './dto/comercializadora.response';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';
import { ListComercializadoraArgsDto } from './dto/comercializadora.where.input';

@ApiTags('[admin] Comercializadoras')
@Controller('comercializadoras')
@UseInterceptors(AuditInterceptor)
export class ComercializadoraController {
  constructor(private readonly comercializadoraService: ComercializadoraService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.COMERCIALIZADORAS_CREAR])
  @ApiDescription('Crear una nueva comercializadora', [PermisoEnum.COMERCIALIZADORAS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseComercializadoraType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'Comercializadoras',
    tabla: 'core_comercializadoras',
    descripcion: 'Crear nueva comercializadora',
  })
  create(@Body() inputDto: CreateComercializadoraDto, @AuthUser() session: IToken) {
    return this.comercializadoraService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.COMERCIALIZADORAS_VER])
  @ApiDescription('Listar todas las comercializadoras', [PermisoEnum.COMERCIALIZADORAS_VER])
  @ApiResponse({ status: 200, type: ResponseComercializadorasType })
  findAll(@Body() query: ListFindAllQueryDto) {
    return this.comercializadoraService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.COMERCIALIZADORAS_VER])
  @ApiDescription('Servicio post con filtros y paginado de comercializadoras', [
    PermisoEnum.COMERCIALIZADORAS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateComercializadorasType })
  list(@Body() inputDto: ListComercializadoraArgsDto) {
    return this.comercializadoraService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.COMERCIALIZADORAS_VER])
  @ApiResponse({ status: 200, type: () => ResponseComercializadoraDetailType })
  @ApiDescription('Obtener una comercializadora por ID', [PermisoEnum.COMERCIALIZADORAS_VER])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.comercializadoraService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.COMERCIALIZADORAS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseComercializadoraType })
  @ApiDescription('Actualizar una comercializadora por ID', [PermisoEnum.COMERCIALIZADORAS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'Comercializadoras',
    tabla: 'core_comercializadoras',
    descripcion: 'Actualizar comercializadora',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdateComercializadoraDto,
    @AuthUser() session: IToken,
  ) {
    return this.comercializadoraService.update(params.id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.COMERCIALIZADORAS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseComercializadoraType })
  @ApiDescription('Eliminar una comercializadora por ID', [PermisoEnum.COMERCIALIZADORAS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'Comercializadoras',
    tabla: 'core_comercializadoras',
    descripcion: 'Eliminar comercializadora',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.comercializadoraService.remove(params.id);
  }
}
