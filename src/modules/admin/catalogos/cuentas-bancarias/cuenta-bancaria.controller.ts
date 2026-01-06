import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import {
  CreateCuentaBancariaDto,
  UpdateCuentaBancariaDto,
  ListCuentaBancariaArgsDto,
} from './dto/cuenta-bancaria.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import {
  PaginateCuentasBancariasType,
  ResponseCuentaBancariaType,
  ResponseCuentaBancariaDetailType,
  ResponseCuentasBancariasType,
} from './dto/cuenta-bancaria.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] Cuentas Bancarias')
@Controller('cuentas-bancarias')
@UseInterceptors(AuditInterceptor)
export class CuentaBancariaController {
  constructor(private readonly cuentaBancariaService: CuentaBancariaService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_CREAR])
  @ApiDescription('Crear una nueva cuenta bancaria', [PermisoEnum.CUENTAS_BANCARIAS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseCuentaBancariaType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'CuentaBancaria',
    descripcion: 'Creación de nueva cuenta bancaria',
  })
  create(@Body() inputDto: CreateCuentaBancariaDto, @AuthUser() session: IToken) {
    return this.cuentaBancariaService.create(inputDto, session);
  }

  @Get('select')
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_VER])
  @ApiDescription('Obtener cuentas bancarias para select', [PermisoEnum.CUENTAS_BANCARIAS_VER])
  @ApiResponse({ type: ResponseCuentasBancariasType })
  getForSelect() {
    return this.cuentaBancariaService.getForSelect();
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_VER])
  @ApiDescription('Listar todas las cuentas bancarias', [PermisoEnum.CUENTAS_BANCARIAS_VER])
  @ApiResponse({ type: ResponseCuentasBancariasType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.cuentaBancariaService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_VER])
  @ApiDescription('Servicio post con filtros y paginado de cuentas bancarias', [
    PermisoEnum.CUENTAS_BANCARIAS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateCuentasBancariasType })
  list(@Body() inputDto: ListCuentaBancariaArgsDto) {
    return this.cuentaBancariaService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_VER])
  @ApiResponse({ status: 200, type: () => ResponseCuentaBancariaDetailType })
  @ApiDescription('Obtener una cuenta bancaria por ID', [PermisoEnum.CUENTAS_BANCARIAS_VER])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentaBancariaService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseCuentaBancariaType })
  @ApiDescription('Actualizar una cuenta bancaria por ID', [PermisoEnum.CUENTAS_BANCARIAS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'CuentaBancaria',
    descripcion: 'Actualización de cuenta bancaria',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCuentaBancariaDto: UpdateCuentaBancariaDto,
    @AuthUser() session: IToken,
  ) {
    return this.cuentaBancariaService.update(id, updateCuentaBancariaDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.CUENTAS_BANCARIAS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseCuentaBancariaType })
  @ApiDescription('Eliminar una cuenta bancaria por ID', [PermisoEnum.CUENTAS_BANCARIAS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'CuentaBancaria',
    descripcion: 'Eliminación de cuenta bancaria',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cuentaBancariaService.remove(id);
  }
}
