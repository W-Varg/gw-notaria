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
import { EstadoTramiteService } from './estado-tramite.service';
import {
  CreateEstadoTramiteDto,
  UpdateEstadoTramiteDto,
  ListEstadoTramiteArgsDto,
} from './dto/estado-tramite.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateEstadosTramiteType,
  ResponseEstadoTramiteType,
  ResponseEstadoTramiteDetailType,
  ResponseEstadosTramiteType,
} from './dto/estado-tramite.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

@ApiTags('[admin] Estados de Trámite')
@Controller('estados-tramite')
@UseInterceptors(AuditInterceptor)
export class EstadoTramiteController {
  constructor(private readonly estadoTramiteService: EstadoTramiteService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.ESTADOS_TRAMITE_CREAR])
  @ApiDescription('Crear un nuevo estado de trámite', [PermisoEnum.ESTADOS_TRAMITE_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseEstadoTramiteType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'EstadoTramite',
    descripcion: 'Crear nuevo estado de trámite',
  })
  create(@Body() inputDto: CreateEstadoTramiteDto, @AuthUser() session: IToken) {
    return this.estadoTramiteService.create(inputDto, session);
  }

  @Get('select')
  @BearerAuthPermision()
  @ApiDescription('Obtener estados de trámite para select')
  @ApiResponse({ type: ResponseEstadosTramiteType })
  getForSelect() {
    return this.estadoTramiteService.getForSelect();
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.ESTADOS_TRAMITE_VER])
  @ApiDescription('Listar todos los estados de trámite', [PermisoEnum.ESTADOS_TRAMITE_VER])
  @ApiResponse({ type: ResponseEstadosTramiteType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.estadoTramiteService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.ESTADOS_TRAMITE_VER])
  @ApiDescription('Servicio post con filtros y paginado de estados de trámite', [
    PermisoEnum.ESTADOS_TRAMITE_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateEstadosTramiteType })
  list(@Body() inputDto: ListEstadoTramiteArgsDto) {
    return this.estadoTramiteService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.ESTADOS_TRAMITE_VER])
  @ApiResponse({ status: 200, type: () => ResponseEstadoTramiteDetailType })
  @ApiDescription('Obtener un estado de trámite por ID', [PermisoEnum.ESTADOS_TRAMITE_VER])
  findOne(@Param('id') id: string) {
    return this.estadoTramiteService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.ESTADOS_TRAMITE_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseEstadoTramiteType })
  @ApiDescription('Actualizar un estado de trámite por ID', [PermisoEnum.ESTADOS_TRAMITE_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'EstadoTramite',
    descripcion: 'Actualizar estado de trámite',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEstadoTramiteDto,
    @AuthUser() session: IToken,
  ) {
    return this.estadoTramiteService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.ESTADOS_TRAMITE_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseEstadoTramiteType })
  @ApiDescription('Eliminar un estado de trámite por ID', [PermisoEnum.ESTADOS_TRAMITE_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'EstadoTramite',
    descripcion: 'Eliminar estado de trámite',
  })
  remove(@Param('id') id: string) {
    return this.estadoTramiteService.remove(id);
  }
}
