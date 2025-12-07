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
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { CategoriaService } from './categoria.service';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
  ListCategoriaArgsDto,
} from './dto/categoria.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateCategoriasType,
  ResponseCategoriaType,
  ResponseCategoriaDetailType,
  ResponseCategoriasType,
} from './dto/categoria.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/generated/prisma/enums';

@ApiTags('[admin] Categorías')
@Controller('categorias')
@UseInterceptors(AuditInterceptor)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_CREAR])
  @ApiDescription('Crear una nueva categoría', [PermisoEnum.CATEGORIAS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'Categoria',
    descripcion: 'Crear nueva categoría',
  })
  create(@Body() inputDto: CreateCategoriaDto, @AuthUser() session: IToken) {
    return this.categoriaService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_VER])
  @ApiDescription('Listar todas las categorías', [PermisoEnum.CATEGORIAS_VER])
  @ApiResponse({ type: ResponseCategoriasType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.categoriaService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_VER])
  @ApiDescription('Servicio post con filtros y paginado de categorías', [
    PermisoEnum.CATEGORIAS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateCategoriasType })
  list(@Body() inputDto: ListCategoriaArgsDto) {
    return this.categoriaService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_VER])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaDetailType })
  @ApiDescription('Obtener una categoría por ID', [PermisoEnum.CATEGORIAS_VER])
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaType })
  @ApiDescription('Actualizar una categoría por ID', [PermisoEnum.CATEGORIAS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'Categoria',
    descripcion: 'Actualizar categoría',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
    @AuthUser() session: IToken,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaType })
  @ApiDescription('Eliminar una categoría por ID', [PermisoEnum.CATEGORIAS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'Categoria',
    descripcion: 'Eliminar categoría',
  })
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(id);
  }
}
