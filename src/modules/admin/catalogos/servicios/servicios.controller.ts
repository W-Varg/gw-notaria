import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { PermisoEnum } from 'src/enums/permisos.enum';
import {
  CreateImagenServicioDto,
  CreateServicioDto,
  ListServiciosArgsDto,
  UpdateServicioDto,
} from './dto/servicios.input.dto';
import {
  PaginateServiciosType,
  ResponseServicioType,
  ResponseServiciosType,
} from './dto/servicios.response';
import { ServiciosService } from './servicios.service';

@ApiTags('[admin] Servicios')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly service: ServiciosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.SERVICIOS_CREAR])
  @ApiDescription('Crear servicio', [PermisoEnum.SERVICIOS_CREAR])
  @ApiResponse({ status: 200, type: ResponseServicioType })
  create(@Body() dto: CreateServicioDto) {
    return this.service.create(dto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Listar servicios con paginación', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: ResponseServiciosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.service.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Listar servicios con filtros avanzados', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: PaginateServiciosType })
  list(@Body() inputDto: ListServiciosArgsDto) {
    return this.service.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_VER])
  @ApiDescription('Obtener servicio por ID', [PermisoEnum.SERVICIOS_VER])
  @ApiResponse({ status: 200, type: ResponseServicioType })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_EDITAR])
  @ApiDescription('Actualizar servicio', [PermisoEnum.SERVICIOS_EDITAR])
  @ApiResponse({ status: 200, type: ResponseServicioType })
  update(@Param('id') id: string, @Body() dto: UpdateServicioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.SERVICIOS_ELIMINAR])
  @ApiDescription('Eliminar servicio', [PermisoEnum.SERVICIOS_ELIMINAR])
  @ApiResponse({ status: 200, type: ResponseServicioType })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  /* ---------------------------- Gestión de imágenes ---------------------------- */
  @Post(':id/imagenes')
  @BearerAuthPermision([PermisoEnum.IMAGENES_SERVICIO_CREAR])
  @ApiDescription('Agregar imagen a servicio', [PermisoEnum.IMAGENES_SERVICIO_CREAR])
  @ApiResponse({ status: 200, type: ResponseServicioType })
  addImagen(@Param('id') id: string, @Body() body: Omit<CreateImagenServicioDto, 'servicioId'>) {
    return this.service.addImagen({ ...body, servicioId: id });
  }

  @Delete('imagenes/:imagenId')
  @BearerAuthPermision([PermisoEnum.IMAGENES_SERVICIO_ELIMINAR])
  @ApiDescription('Eliminar imagen de servicio', [PermisoEnum.IMAGENES_SERVICIO_ELIMINAR])
  @ApiResponse({ status: 200, type: ResponseServicioType })
  removeImagen(@Param('imagenId') imagenId: string) {
    return this.service.removeImagen(imagenId);
  }
}
