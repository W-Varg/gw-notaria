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
import { ClienteService } from './cliente.service';
import { CreateClienteDto, UpdateClienteDto, ListClienteArgsDto } from './dto/cliente.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateClientesType,
  ResponseClienteType,
  ResponseClienteDetailType,
  ResponseClientesType,
} from './dto/cliente.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[admin] Clientes')
@Controller('admin/clientes')
@UseInterceptors(AuditInterceptor)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.CLIENTES_CREAR])
  @ApiDescription('Crear un nuevo cliente', [PermisoEnum.CLIENTES_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseClienteType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'clientes',
    tabla: 'Cliente',
    descripcion: 'Crear nuevo cliente',
  })
  create(@Body() inputDto: CreateClienteDto, @AuthUser() session: IToken) {
    return this.clienteService.create(inputDto, session);
  }

  @Get('select')
  @BearerAuthPermision([PermisoEnum.CLIENTES_VER])
  @ApiDescription('Obtener clientes para select', [PermisoEnum.CLIENTES_VER])
  @ApiResponse({ type: ResponseClientesType })
  getForSelect() {
    return this.clienteService.getForSelect();
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.CLIENTES_VER])
  @ApiDescription('Listar todos los clientes', [PermisoEnum.CLIENTES_VER])
  @ApiResponse({ type: ResponseClientesType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.clienteService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.CLIENTES_VER])
  @ApiDescription('Servicio post con filtros y paginado de clientes', [PermisoEnum.CLIENTES_VER])
  @ApiResponse({ status: 200, type: () => PaginateClientesType })
  list(@Body() inputDto: ListClienteArgsDto) {
    return this.clienteService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.CLIENTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseClienteDetailType })
  @ApiDescription('Obtener un cliente por ID', [PermisoEnum.CLIENTES_VER])
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.CLIENTES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseClienteType })
  @ApiDescription('Actualizar un cliente por ID', [PermisoEnum.CLIENTES_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'clientes',
    tabla: 'Cliente',
    descripcion: 'Actualizar cliente',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClienteDto,
    @AuthUser() session: IToken,
  ) {
    return this.clienteService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.CLIENTES_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseClienteType })
  @ApiDescription('Eliminar un cliente por ID', [PermisoEnum.CLIENTES_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'clientes',
    tabla: 'Cliente',
    descripcion: 'Eliminar cliente',
  })
  remove(@Param() params: CommonParamsDto.IdString) {
    return this.clienteService.remove(params.id);
  }
}
