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
import { TipoDocumentoService } from './tipo-documento.service';
import {
  CreateTipoDocumentoDto,
  UpdateTipoDocumentoDto,
  ListTipoDocumentoArgsDto,
} from './dto/tipo-documento.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateTipoDocumentosType,
  ResponseTipoDocumentoType,
  ResponseTipoDocumentoDetailType,
  ResponseTipoDocumentosType,
} from './dto/tipo-documento.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[admin] Tipos de Documento')
@Controller('tipos-documento')
@UseInterceptors(AuditInterceptor)
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.TIPOS_DOCUMENTO_CREAR])
  @ApiDescription('Crear un nuevo tipo de documento', [PermisoEnum.TIPOS_DOCUMENTO_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoDocumentoType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'TipoDocumento',
    descripcion: 'Crear nuevo tipo de documento',
  })
  create(@Body() inputDto: CreateTipoDocumentoDto, @AuthUser() session: IToken) {
    return this.tipoDocumentoService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.TIPOS_DOCUMENTO_VER])
  @ApiDescription('Listar todos los tipos de documento', [PermisoEnum.TIPOS_DOCUMENTO_VER])
  @ApiResponse({ status: 200, type: ResponseTipoDocumentosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.tipoDocumentoService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.TIPOS_DOCUMENTO_VER])
  @ApiDescription('Servicio post con filtros y paginado de tipos de documento', [
    PermisoEnum.TIPOS_DOCUMENTO_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateTipoDocumentosType })
  list(@Body() inputDto: ListTipoDocumentoArgsDto) {
    return this.tipoDocumentoService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_DOCUMENTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseTipoDocumentoDetailType })
  @ApiDescription('Obtener un tipo de documento por ID', [PermisoEnum.TIPOS_DOCUMENTO_VER])
  findOne(@Param() params: CommonParamsDto.IdUuid) {
    return this.tipoDocumentoService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_DOCUMENTO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoDocumentoType })
  @ApiDescription('Actualizar un tipo de documento por ID', [PermisoEnum.TIPOS_DOCUMENTO_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'TipoDocumento',
    descripcion: 'Actualizar tipo de documento',
  })
  update(
    @Param() params: CommonParamsDto.IdUuid,
    @Body() updateDto: UpdateTipoDocumentoDto,
    @AuthUser() session: IToken,
  ) {
    return this.tipoDocumentoService.update(params.id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.TIPOS_DOCUMENTO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseTipoDocumentoType })
  @ApiDescription('Eliminar un tipo de documento por ID', [PermisoEnum.TIPOS_DOCUMENTO_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'TipoDocumento',
    descripcion: 'Eliminar tipo de documento',
  })
  remove(@Param() params: CommonParamsDto.IdUuid) {
    return this.tipoDocumentoService.remove(params.id);
  }
}
