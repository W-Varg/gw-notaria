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
  StreamableFile,
} from '@nestjs/common';
import { AuthUser, IToken } from '../../../../common/decorators/token.decorator';
import { PagosIngresosService } from './pagos-ingresos.service';
import {
  CreatePagosIngresosDto,
  UpdatePagosIngresosDto,
  ListPagosIngresosArgsDto,
} from './dto/pagos-ingresos.input.dto';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginatePagosIngresosType,
  ResponsePagosIngresosType,
  ResponsePagosIngresosDetailType,
  ResponseListPagosIngresosType,
} from './dto/pagos-ingresos.response';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../../enums/tipo-accion.enum';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';

@ApiTags('[admin] Pagos e Ingresos')
@Controller('pagos-ingresos')
@UseInterceptors(AuditInterceptor)
export class PagosIngresosController {
  constructor(private readonly pagosIngresosService: PagosIngresosService) {}

  @Get('recibo')
  async recibo() {
    const documento = await this.pagosIngresosService.getRecibo();

    return new StreamableFile(documento, {
      disposition: `inline; filename="recibo.pdf"`,
      type: 'application/pdf',
    });
  }

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
  @ApiResponse({ status: 200, type: ResponseListPagosIngresosType })
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
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.pagosIngresosService.findOne(params.id);
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
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdatePagosIngresosDto,
    @AuthUser() session: IToken,
  ) {
    return this.pagosIngresosService.update(params.id, updateDto, session);
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
  remove(@Param() params: CommonParamsDto.Id) {
    return this.pagosIngresosService.remove(params.id);
  }
}
