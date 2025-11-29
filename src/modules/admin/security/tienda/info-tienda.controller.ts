import { Controller, Get, Patch, Body } from '@nestjs/common';
import { InformacionTiendaService } from './info-tienda.service';
import { UpdateInformacionTiendaDto } from './dto/info-tienda.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInformacionTiendaType } from './dto/info-tienda.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';

@ApiTags('[admin] Información de Tienda')
@Controller('informacion-tienda')
export class InformacionTiendaController {
  constructor(private readonly informacionTiendaService: InformacionTiendaService) {}

  @Get()
  @BearerAuthPermision([PermisoEnum.CONFIGURACION_VER])
  @ApiDescription('Obtener información de la tienda', [PermisoEnum.CONFIGURACION_VER])
  @ApiResponse({ status: 200, type: () => ResponseInformacionTiendaType })
  findOne() {
    return this.informacionTiendaService.findOne();
  }

  @Patch()
  @BearerAuthPermision([PermisoEnum.CONFIGURACION_EDITAR])
  @ApiDescription('Actualizar información de la tienda', [PermisoEnum.CONFIGURACION_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseInformacionTiendaType })
  update(@Body() updateInformacionTiendaDto: UpdateInformacionTiendaDto) {
    return this.informacionTiendaService.update(updateInformacionTiendaDto);
  }
}
