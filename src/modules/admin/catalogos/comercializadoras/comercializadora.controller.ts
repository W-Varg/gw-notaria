import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ComercializadoraService } from './comercializadora.service';
import {
  CreateComercializadoraDto,
  UpdateComercializadoraDto,
  ListComercializadoraArgsDto,
} from './dto/comercializadora.input.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums';

@ApiTags('[admin] Comercializadoras')
@Controller('comercializadoras')
@UseInterceptors(AuditInterceptor)
export class ComercializadoraController {
  constructor(private readonly comercializadoraService: ComercializadoraService) {}

  @Post()
  @BearerAuthPermision(PermisoEnum.TIPOS_TRAMITE_CREAR)
  @Audit({ accion: TipoAccionEnum.CREATE, modulo: 'Comercializadoras' })
  @ApiOperation({ summary: 'Crear una nueva comercializadora' })
  @ApiResponse({ status: 201, description: 'Comercializadora creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDto: CreateComercializadoraDto, @AuthUser() session: IToken) {
    return this.comercializadoraService.create(createDto, session);
  }

  @Get()
  @BearerAuthPermision(PermisoEnum.TIPOS_TRAMITE_VER)
  @ApiOperation({ summary: 'Listar todas las comercializadoras' })
  @ApiResponse({ status: 200, description: 'Lista de comercializadoras' })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.comercializadoraService.findAll(query);
  }

  @Post('filter')
  @BearerAuthPermision(PermisoEnum.TIPOS_TRAMITE_VER)
  @ApiOperation({ summary: 'Filtrar comercializadoras' })
  @ApiResponse({ status: 200, description: 'Lista filtrada de comercializadoras' })
  filter(@Body() filterDto: ListComercializadoraArgsDto) {
    return this.comercializadoraService.filter(filterDto);
  }

  @Get(':id')
  @BearerAuthPermision(PermisoEnum.TIPOS_TRAMITE_VER)
  @ApiOperation({ summary: 'Obtener una comercializadora por ID' })
  @ApiResponse({ status: 200, description: 'Comercializadora encontrada' })
  @ApiResponse({ status: 404, description: 'Comercializadora no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comercializadoraService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision(PermisoEnum.TIPOS_TRAMITE_EDITAR)
  @Audit({ accion: TipoAccionEnum.UPDATE, modulo: 'Comercializadoras' })
  @ApiOperation({ summary: 'Actualizar una comercializadora' })
  @ApiResponse({ status: 200, description: 'Comercializadora actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Comercializadora no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateComercializadoraDto,
    @AuthUser() session: IToken,
  ) {
    return this.comercializadoraService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision(PermisoEnum.TIPOS_TRAMITE_ELIMINAR)
  @Audit({ accion: TipoAccionEnum.DELETE, modulo: 'Comercializadoras' })
  @ApiOperation({ summary: 'Eliminar una comercializadora' })
  @ApiResponse({ status: 200, description: 'Comercializadora eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Comercializadora no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comercializadoraService.remove(id);
  }
}
