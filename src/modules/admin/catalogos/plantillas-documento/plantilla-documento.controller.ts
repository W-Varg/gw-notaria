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
import { AuthUser, IToken } from '../../../../common/decorators/token.decorator';
import { PlantillaDocumentoService } from './plantilla-documento.service';
import {
  CreatePlantillaDocumentoDto,
  UpdatePlantillaDocumentoDto,
  ListPlantillaDocumentoArgsDto,
} from './dto/plantilla-documento.input.dto';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatePlantillaDocumentosType,
  ResponsePlantillaDocumentoType,
  ResponsePlantillaDocumentoDetailType,
  ResponsePlantillaDocumentosType,
} from './dto/plantilla-documento.response';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../../enums/tipo-accion.enum';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';

@ApiTags('[admin] Plantillas de Documento')
@Controller('plantillas-documento')
@UseInterceptors(AuditInterceptor)
export class PlantillaDocumentoController {
  constructor(private readonly plantillaDocumentoService: PlantillaDocumentoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.PLANTILLAS_DOCUMENTO_CREAR])
  @ApiDescription('Crear una nueva plantilla de documento', [
    PermisoEnum.PLANTILLAS_DOCUMENTO_CREAR,
  ])
  @ApiResponse({ status: 200, type: () => ResponsePlantillaDocumentoType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'PlantillaDocumento',
    descripcion: 'Crear nueva plantilla de documento',
  })
  create(@Body() inputDto: CreatePlantillaDocumentoDto, @AuthUser() session: IToken) {
    return this.plantillaDocumentoService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.PLANTILLAS_DOCUMENTO_VER])
  @ApiDescription('Listar todas las plantillas de documento', [
    PermisoEnum.PLANTILLAS_DOCUMENTO_VER,
  ])
  @ApiResponse({ status: 200, type: ResponsePlantillaDocumentosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.plantillaDocumentoService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.PLANTILLAS_DOCUMENTO_VER])
  @ApiDescription('Servicio post con filtros y paginado de plantillas de documento', [
    PermisoEnum.PLANTILLAS_DOCUMENTO_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginatePlantillaDocumentosType })
  list(@Body() inputDto: ListPlantillaDocumentoArgsDto) {
    return this.plantillaDocumentoService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.PLANTILLAS_DOCUMENTO_VER])
  @ApiResponse({ status: 200, type: () => ResponsePlantillaDocumentoDetailType })
  @ApiDescription('Obtener una plantilla de documento por ID', [
    PermisoEnum.PLANTILLAS_DOCUMENTO_VER,
  ])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.plantillaDocumentoService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.PLANTILLAS_DOCUMENTO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponsePlantillaDocumentoType })
  @ApiDescription('Actualizar una plantilla de documento por ID', [
    PermisoEnum.PLANTILLAS_DOCUMENTO_EDITAR,
  ])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'PlantillaDocumento',
    descripcion: 'Actualizar plantilla de documento',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdatePlantillaDocumentoDto,
    @AuthUser() session: IToken,
  ) {
    return this.plantillaDocumentoService.update(params.id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.PLANTILLAS_DOCUMENTO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponsePlantillaDocumentoType })
  @ApiDescription('Eliminar una plantilla de documento por ID', [
    PermisoEnum.PLANTILLAS_DOCUMENTO_ELIMINAR,
  ])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'PlantillaDocumento',
    descripcion: 'Eliminar plantilla de documento',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.plantillaDocumentoService.remove(params.id);
  }
}
