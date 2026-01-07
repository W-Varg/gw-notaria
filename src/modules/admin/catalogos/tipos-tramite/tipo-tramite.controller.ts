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
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { TipoTramiteService } from './tipo-tramite.service';
import {
  CreateTipoTramiteDto,
  UpdateTipoTramiteDto,
  ListTipoTramiteArgsDto,
} from './dto/tipo-tramite.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateTiposTramiteType,
  ResponseTiposTramiteType,
  ResponseTipoTramiteDetailType,
  ResponseTipoTramiteType,
} from './dto/tipo-tramite.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

@ApiTags('[admin] Tipos de Trámite')
@Controller('tipos-tramite')
@UseInterceptors(AuditInterceptor)
export class TipoTramiteController {
  constructor(private readonly tipoTramiteService: TipoTramiteService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.TIPOS_TRAMITE_CREAR])
  @ApiDescription('Crear un nuevo tipo de trámite', [PermisoEnum.TIPOS_TRAMITE_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoTramiteType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'TipoTramite',
    descripcion: 'Crear nuevo tipo de trámite',
  })
  create(@Body() inputDto: CreateTipoTramiteDto, @AuthUser() session: IToken) {
    return this.tipoTramiteService.create(inputDto, session);
  }

  // @Get()
  // @BearerAuthPermision([PermisoEnum.TIPOS_TRAMITE_VER])
  // @ApiDescription('Listar todos los tipos de trámite', [PermisoEnum.TIPOS_TRAMITE_VER])
  // @ApiResponse({ status: 200, type: ResponseTiposTramiteType })
  // findAll(@Query() query: ListFindAllQueryDto) {
  //   return this.tipoTramiteService.findAll(query);
  // }

  @Get()
  @BearerAuthPermision()
  @ApiDescription('Listar todos los tipos de trámite')
  @ApiResponse({ status: 200, type: PaginateTiposTramiteType })
  findAll() {
    return this.tipoTramiteService.select();
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.TIPOS_TRAMITE_VER])
  @ApiDescription('Servicio post con filtros y paginado de tipos de trámite', [
    PermisoEnum.TIPOS_TRAMITE_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateTiposTramiteType })
  list(@Body() inputDto: ListTipoTramiteArgsDto) {
    return this.tipoTramiteService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_TRAMITE_VER])
  @ApiResponse({ status: 200, type: () => ResponseTipoTramiteDetailType })
  @ApiDescription('Obtener un tipo de trámite por ID', [PermisoEnum.TIPOS_TRAMITE_VER])
  findOne(@Param('id') id: string) {
    return this.tipoTramiteService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_TRAMITE_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoTramiteType })
  @ApiDescription('Actualizar un tipo de trámite por ID', [PermisoEnum.TIPOS_TRAMITE_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'TipoTramite',
    descripcion: 'Actualizar tipo de trámite',
  })
  update(
    @Param('id') id: string,
    @Body() updateTipoTramiteDto: UpdateTipoTramiteDto,
    @AuthUser() session: IToken,
  ) {
    return this.tipoTramiteService.update(id, updateTipoTramiteDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_TRAMITE_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoTramiteType })
  @ApiDescription('Eliminar un tipo de trámite por ID', [PermisoEnum.TIPOS_TRAMITE_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'TipoTramite',
    descripcion: 'Eliminar tipo de trámite',
  })
  remove(@Param('id') id: string) {
    return this.tipoTramiteService.remove(id);
  }
}
