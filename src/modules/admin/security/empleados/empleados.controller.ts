import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import {
  CreateEmpleadoDto,
  ListEmpleadoArgsDto,
  UpdateEmpleadoDto,
} from './dto/empleados.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateEmpleadosType,
  ResponseEmpleadoDetailType,
  ResponseEmpleadoType,
  ResponseEmpleadosType,
} from './dto/empleados.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] Empleados')
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_CREAR])
  @ApiDescription('Crear un nuevo empleado', [PermisoEnum.EMPLEADOS_CREAR])
  @ApiResponse({ status: 201, type: ResponseEmpleadoType })
  create(@Body() inputDto: CreateEmpleadoDto) {
    return this.empleadosService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_VER])
  @ApiDescription('Listar todos los empleados', [PermisoEnum.EMPLEADOS_VER])
  @ApiResponse({ status: 200, type: ResponseEmpleadosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.empleadosService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_VER])
  @ApiDescription('Servicio POST con filtros y paginado de empleados', [PermisoEnum.EMPLEADOS_VER])
  @ApiResponse({ status: 200, type: PaginateEmpleadosType })
  list(@Body() inputDto: ListEmpleadoArgsDto) {
    return this.empleadosService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_VER])
  @ApiResponse({ status: 200, type: ResponseEmpleadoDetailType })
  @ApiDescription('Obtener un empleado por ID', [PermisoEnum.EMPLEADOS_VER])
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_EDITAR])
  @ApiDescription('Actualizar un empleado', [PermisoEnum.EMPLEADOS_EDITAR])
  @ApiResponse({ status: 200, type: ResponseEmpleadoType })
  update(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadosService.update(id, updateEmpleadoDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_ELIMINAR])
  @ApiDescription('Eliminar un empleado (soft delete)', [PermisoEnum.EMPLEADOS_ELIMINAR])
  @ApiResponse({ status: 200, type: ResponseEmpleadoType })
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(id);
  }

  @Post(':id/asignar-sucursal')
  @BearerAuthPermision([PermisoEnum.EMPLEADOS_ASIGNAR_SUCURSAL])
  @ApiDescription('Asignar o remover sucursal de un empleado', [
    PermisoEnum.EMPLEADOS_ASIGNAR_SUCURSAL,
  ])
  @ApiResponse({ status: 200, type: ResponseEmpleadoType })
  assignSucursal(@Param('id') empleadoId: string, @Body() body: { sucursalId: string | null }) {
    return this.empleadosService.assignSucursal(empleadoId, body.sucursalId);
  }
}
