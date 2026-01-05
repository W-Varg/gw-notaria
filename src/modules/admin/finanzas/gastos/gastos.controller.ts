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
import { GastosService } from './gastos.service';
import { CreateGastosDto, UpdateGastosDto, ListGastosArgsDto } from './dto/gastos.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateGastosType,
  ResponseGastosType,
  ResponseGastosDetailType,
  ResponseListGastosType,
} from './dto/gastos.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

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
  @ApiResponse({ type: ResponseListGastosType })
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gastosService.findOne(id);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGastosDto,
    @AuthUser() session: IToken,
  ) {
    return this.gastosService.update(id, updateDto, session);
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gastosService.remove(id);
  }
}
