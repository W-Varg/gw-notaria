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
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { ArqueosDiariosService } from './arqueos-diarios.service';
import {
  CreateArqueosDiariosDto,
  UpdateArqueosDiariosDto,
  ListArqueosDiariosArgsDto,
} from './dto/arqueos-diarios.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateArqueosDiariosType,
  ResponseArqueosDiariosType,
  ResponseArqueosDiariosDetailType,
  ResponseListArqueosDiariosType,
} from './dto/arqueos-diarios.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[admin] Arqueos Diarios')
@Controller('arqueos-diarios')
@UseInterceptors(AuditInterceptor)
export class ArqueosDiariosController {
  constructor(private readonly arqueosDiariosService: ArqueosDiariosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.ARQUEOS_DIARIOS_CREAR])
  @ApiDescription('Registrar un nuevo arqueo diario', [PermisoEnum.ARQUEOS_DIARIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseArqueosDiariosType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'finanzas',
    tabla: 'ArqueosDiarios',
    descripcion: 'Registrar nuevo arqueo diario',
  })
  create(@Body() inputDto: CreateArqueosDiariosDto, @AuthUser() session: IToken) {
    return this.arqueosDiariosService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.ARQUEOS_DIARIOS_VER])
  @ApiDescription('Listar todos los arqueos diarios', [PermisoEnum.ARQUEOS_DIARIOS_VER])
  @ApiResponse({ status: 200, type: ResponseListArqueosDiariosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.arqueosDiariosService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.ARQUEOS_DIARIOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de arqueos diarios', [
    PermisoEnum.ARQUEOS_DIARIOS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateArqueosDiariosType })
  list(@Body() inputDto: ListArqueosDiariosArgsDto) {
    return this.arqueosDiariosService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.ARQUEOS_DIARIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseArqueosDiariosDetailType })
  @ApiDescription('Obtener un arqueo diario por ID', [PermisoEnum.ARQUEOS_DIARIOS_VER])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.arqueosDiariosService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.ARQUEOS_DIARIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseArqueosDiariosType })
  @ApiDescription('Actualizar un arqueo diario por ID', [PermisoEnum.ARQUEOS_DIARIOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'finanzas',
    tabla: 'ArqueosDiarios',
    descripcion: 'Actualizar arqueo diario',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdateArqueosDiariosDto,
    @AuthUser() session: IToken,
  ) {
    return this.arqueosDiariosService.update(params.id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.ARQUEOS_DIARIOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseArqueosDiariosType })
  @ApiDescription('Eliminar un arqueo diario por ID', [PermisoEnum.ARQUEOS_DIARIOS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'finanzas',
    tabla: 'ArqueosDiarios',
    descripcion: 'Eliminar arqueo diario',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.arqueosDiariosService.remove(params.id);
  }
}
