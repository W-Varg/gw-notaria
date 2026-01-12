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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { SucursalService } from './sucursal.service';
import {
  CreateSucursalDto,
  UpdateSucursalDto,
  ListSucursalArgsDto,
} from './dto/sucursal.input.dto';
import {
  ResponseSucursalType,
  ResponseSucursalDetailType,
  ResponseSucursalesType,
  PaginateSucursalesType,
} from './dto/sucursal.response';
import { TipoAccionEnum } from 'src/enums';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[admin] Sucursales')
@Controller('sucursales')
@UseInterceptors(AuditInterceptor)
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.SUCURSALES_CREAR])
  @ApiDescription('Crear una nueva sucursal', [PermisoEnum.SUCURSALES_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'Sucursal',
    descripcion: 'Crear nueva sucursal',
  })
  create(@Body() inputDto: CreateSucursalDto, @AuthUser() session: IToken) {
    return this.sucursalService.create(inputDto, session);
  }

  @Get('select')
  @BearerAuthPermision()
  @ApiDescription('Obtener sucursales para select/dropdown')
  @ApiResponse({ status: 200, type: ResponseSucursalesType })
  getForSelect() {
    return this.sucursalService.getForSelect();
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
  @ApiDescription('Listar todas las sucursales', [PermisoEnum.SUCURSALES_VER])
  @ApiResponse({ status: 200, type: ResponseSucursalesType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.sucursalService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
  @ApiDescription('Servicio post con filtros y paginado de sucursales', [
    PermisoEnum.SUCURSALES_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateSucursalesType })
  list(@Body() inputDto: ListSucursalArgsDto) {
    return this.sucursalService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
  @ApiResponse({ status: 200, type: () => ResponseSucursalDetailType })
  @ApiDescription('Obtener una sucursal por ID', [PermisoEnum.SUCURSALES_VER])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.sucursalService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  @ApiDescription('Actualizar una sucursal por ID', [PermisoEnum.SUCURSALES_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'Sucursal',
    descripcion: 'Actualizar sucursal',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateDto: UpdateSucursalDto,
    @AuthUser() session: IToken,
  ) {
    return this.sucursalService.update(params.id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.SUCURSALES_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseSucursalType })
  @ApiDescription('Eliminar una sucursal por ID', [PermisoEnum.SUCURSALES_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'Sucursal',
    descripcion: 'Eliminar sucursal',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.sucursalService.remove(params.id);
  }
}
