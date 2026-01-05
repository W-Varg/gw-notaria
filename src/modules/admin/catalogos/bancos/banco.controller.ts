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
import { BancoService } from './banco.service';
import { CreateBancoDto, UpdateBancoDto, ListBancoArgsDto } from './dto/banco.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import {
  PaginateBancosType,
  ResponseBancoType,
  ResponseBancoDetailType,
  ResponseBancosType,
} from './dto/banco.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

@ApiTags('[admin] Bancos')
@Controller('bancos')
@UseInterceptors(AuditInterceptor)
export class BancoController {
  constructor(private readonly bancoService: BancoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.BANCOS_CREAR])
  @ApiDescription('Crear un nuevo banco', [PermisoEnum.BANCOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseBancoType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'Banco',
    descripcion: 'Creación de nuevo banco',
  })
  create(@Body() inputDto: CreateBancoDto, @AuthUser() session: IToken) {
    return this.bancoService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.BANCOS_VER])
  @ApiDescription('Listar todos los bancos', [PermisoEnum.BANCOS_VER])
  @ApiResponse({ type: ResponseBancosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.bancoService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.BANCOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de bancos', [PermisoEnum.BANCOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateBancosType })
  list(@Body() inputDto: ListBancoArgsDto) {
    return this.bancoService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.BANCOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseBancoDetailType })
  @ApiDescription('Obtener un banco por ID', [PermisoEnum.BANCOS_VER])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bancoService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.BANCOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseBancoType })
  @ApiDescription('Actualizar un banco por ID', [PermisoEnum.BANCOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'Banco',
    descripcion: 'Actualización de banco',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBancoDto: UpdateBancoDto,
    @AuthUser() session: IToken,
  ) {
    return this.bancoService.update(id, updateBancoDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.BANCOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseBancoType })
  @ApiDescription('Eliminar un banco por ID', [PermisoEnum.BANCOS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'Banco',
    descripcion: 'Eliminación de banco',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bancoService.remove(id);
  }
}
