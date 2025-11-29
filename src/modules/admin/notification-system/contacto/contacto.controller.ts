import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import {
  CategoriaMensaje,
  EstadoMensaje,
  ListContactoArgsDto,
  CreateMensajeContactoDto,
  MarcarComoLeidoDto,
  ResponderMensajeDto,
  UpdateMensajeContactoDto,
} from './dto/contacto.dto';
import {
  EstadisticasContactoResponse,
  MarcarLeidoResponse,
  PaginateMensajesContactoType,
  RespuestaMensajeResponse,
  ResponseMensajeContactoType,
  ResponseMensajesContactoType,
} from './dto/contacto.response';
import { ContactoService } from './contacto.service';

@ApiTags('[admin] Contacto')
@Controller('admin/contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post()
  @ApiDescription('Crear mensaje de contacto')
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  create(@Body() input: CreateMensajeContactoDto, req: any) {
    return this.contactoService.create(req, input);
  }

  @Post('lista')
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Listar mensajes con filtros', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => PaginateMensajesContactoType })
  list(@Body() input: ListContactoArgsDto) {
    return this.contactoService.filter(input);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Listar todos los mensajes', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseMensajesContactoType })
  findAll() {
    return this.contactoService.findAll();
  }

  @Get('no-leidos')
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Listar mensajes no leídos', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseMensajesContactoType })
  getMensajesNoLeidos() {
    return this.contactoService.getMensajesNoLeidos();
  }

  @Get('estado/:estado')
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Listar mensajes por estado', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseMensajesContactoType })
  getMensajesPorEstado(@Param('estado') estado: EstadoMensaje) {
    return this.contactoService.getMensajesPorEstado(estado);
  }

  @Get('categoria/:categoria')
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Listar mensajes por categoría', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseMensajesContactoType })
  getMensajesPorCategoria(@Param('categoria') categoria: CategoriaMensaje) {
    return this.contactoService.getMensajesPorCategoria(categoria);
  }

  @Get('estadisticas')
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Obtener estadísticas de mensajes', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => EstadisticasContactoResponse })
  getEstadisticas() {
    return this.contactoService.getEstadisticas();
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.CONTACTO_VER])
  @ApiDescription('Obtener mensaje por ID', [PermisoEnum.CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  findOne(@Param('id') id: string) {
    return this.contactoService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.CONTACTO_EDITAR])
  @ApiDescription('Actualizar mensaje por ID', [PermisoEnum.CONTACTO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  update(@Param('id') id: string, @Body() input: UpdateMensajeContactoDto) {
    return this.contactoService.update(id, input);
  }

  @Patch(':id/responder')
  @BearerAuthPermision([PermisoEnum.CONTACTO_EDITAR])
  @ApiDescription('Responder mensaje', [PermisoEnum.CONTACTO_EDITAR])
  @ApiResponse({ status: 200, type: () => RespuestaMensajeResponse })
  responderMensaje(@Param('id') id: string, @Body() input: ResponderMensajeDto) {
    return this.contactoService.responderMensaje(id, input);
  }

  @Patch('marcar-leidos')
  @BearerAuthPermision([PermisoEnum.CONTACTO_EDITAR])
  @ApiDescription('Marcar mensajes como leídos', [PermisoEnum.CONTACTO_EDITAR])
  @ApiResponse({ status: 200, type: () => MarcarLeidoResponse })
  marcarComoLeido(@Body() input: MarcarComoLeidoDto) {
    return this.contactoService.marcarComoLeido(input);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.CONTACTO_ELIMINAR])
  @ApiDescription('Eliminar mensaje por ID', [PermisoEnum.CONTACTO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  remove(@Param('id') id: string) {
    return this.contactoService.remove(id);
  }
}
