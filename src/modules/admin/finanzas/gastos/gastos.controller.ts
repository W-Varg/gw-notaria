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
import { AuthUser, IToken } from '../../../../common/decorators/token.decorator';
import { GastosService } from './gastos.service';
import { CreateGastosDto, UpdateGastosDto, ListGastosArgsDto } from './dto/gastos.input.dto';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateGastosType,
  ResponseGastosType,
  ResponseGastosDetailType,
  ResponseListGastosType,
} from './dto/gastos.response';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../../enums/tipo-accion.enum';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';

@ApiTags('[admin] Gastos')
@Controller('gastos')
@UseInterceptors(AuditInterceptor)
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.GASTOS_CREAR])
  @ApiDescription('Registrar un nuevo gasto', [PermisoEnum.GASTOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseGastosType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'finanzas',
    tabla: 'Gastos',
    descripcion: 'Registrar nuevo gasto',
  })
  create(@Body() inputDto: CreateGastosDto, @AuthUser() session: IToken) {
    return this.gastosService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.GASTOS_VER])
  @ApiDescription('Listar todos los gastos', [PermisoEnum.GASTOS_VER])
  @ApiResponse({ status: 200, type: ResponseListGastosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.gastosService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.GASTOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de gastos', [PermisoEnum.GASTOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateGastosType })
  list(@Body() inputDto: ListGastosArgsDto) {
    return this.gastosService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.GASTOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseGastosDetailType })
  @ApiDescription('Obtener un gasto por ID', [PermisoEnum.GASTOS_VER])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.gastosService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.GASTOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseGastosType })
  @ApiDescription('Actualizar un gasto por ID', [PermisoEnum.GASTOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'finanzas',
    tabla: 'Gastos',
    descripcion: 'Actualizar gasto',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdateGastosDto,
    @AuthUser() session: IToken,
  ) {
    return this.gastosService.update(params.id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.GASTOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseGastosType })
  @ApiDescription('Eliminar un gasto por ID', [PermisoEnum.GASTOS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'finanzas',
    tabla: 'Gastos',
    descripcion: 'Eliminar gasto',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.gastosService.remove(params.id);
  }
}
