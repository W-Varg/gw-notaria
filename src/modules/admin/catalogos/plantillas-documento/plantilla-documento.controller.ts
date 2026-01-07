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
import { PlantillaDocumentoService } from './plantilla-documento.service';
import {
  CreatePlantillaDocumentoDto,
  UpdatePlantillaDocumentoDto,
  ListPlantillaDocumentoArgsDto,
} from './dto/plantilla-documento.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatePlantillaDocumentosType,
  ResponsePlantillaDocumentoType,
  ResponsePlantillaDocumentoDetailType,
  ResponsePlantillaDocumentosType,
} from './dto/plantilla-documento.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

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
  findOne(@Param('id') id: number) {
    return this.plantillaDocumentoService.findOne(id);
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
    @Param('id') id: number,
    @Body() updateDto: UpdatePlantillaDocumentoDto,
    @AuthUser() session: IToken,
  ) {
    return this.plantillaDocumentoService.update(id, updateDto, session);
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
  remove(@Param('id') id: number) {
    return this.plantillaDocumentoService.remove(id);
  }
}
