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
import { PagosIngresosService } from './pagos-ingresos.service';
import {
  CreatePagosIngresosDto,
  UpdatePagosIngresosDto,
  ListPagosIngresosArgsDto,
} from './dto/pagos-ingresos.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatePagosIngresosType,
  ResponsePagosIngresosType,
  ResponsePagosIngresosDetailType,
  ResponseListPagosIngresosType,
} from './dto/pagos-ingresos.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/generated/prisma/enums';

@ApiTags('[admin] Pagos e Ingresos')
@Controller('pagos-ingresos')
@UseInterceptors(AuditInterceptor)
export class PagosIngresosController {
  constructor(private readonly pagosIngresosService: PagosIngresosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.PAGOS_INGRESOS_CREAR])
  @ApiDescription('Registrar un nuevo pago o ingreso', [PermisoEnum.PAGOS_INGRESOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponsePagosIngresosType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'finanzas',
    tabla: 'PagosIngresos',
    descripcion: 'Registrar nuevo pago/ingreso',
  })
  create(@Body() inputDto: CreatePagosIngresosDto, @AuthUser() session: IToken) {
    return this.pagosIngresosService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.PAGOS_INGRESOS_VER])
  @ApiDescription('Listar todos los pagos e ingresos', [PermisoEnum.PAGOS_INGRESOS_VER])
  @ApiResponse({ type: ResponseListPagosIngresosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.pagosIngresosService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.PAGOS_INGRESOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de pagos e ingresos', [
    PermisoEnum.PAGOS_INGRESOS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginatePagosIngresosType })
  list(@Body() inputDto: ListPagosIngresosArgsDto) {
    return this.pagosIngresosService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.PAGOS_INGRESOS_VER])
  @ApiResponse({ status: 200, type: () => ResponsePagosIngresosDetailType })
  @ApiDescription('Obtener un pago/ingreso por ID', [PermisoEnum.PAGOS_INGRESOS_VER])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagosIngresosService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.PAGOS_INGRESOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponsePagosIngresosType })
  @ApiDescription('Actualizar un pago/ingreso por ID', [PermisoEnum.PAGOS_INGRESOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'finanzas',
    tabla: 'PagosIngresos',
    descripcion: 'Actualizar pago/ingreso',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePagosIngresosDto,
    @AuthUser() session: IToken,
  ) {
    return this.pagosIngresosService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.PAGOS_INGRESOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponsePagosIngresosType })
  @ApiDescription('Eliminar un pago/ingreso por ID', [PermisoEnum.PAGOS_INGRESOS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'finanzas',
    tabla: 'PagosIngresos',
    descripcion: 'Eliminar pago/ingreso',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagosIngresosService.remove(id);
  }
}
