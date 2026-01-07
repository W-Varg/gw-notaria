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
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificacionService } from './notificacion.service';
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  ListNotificacionArgsDto,
} from './dto/notificacion.input.dto';
import {
  ResponseNotificacionType,
  ResponseNotificacionDetailType,
  ResponseNotificacionesType,
  PaginateNotificacionesType,
} from './dto/notificacion.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

@ApiTags('[admin] Notificaciones')
@Controller('notificaciones')
@UseInterceptors(AuditInterceptor)
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_CREAR])
  @ApiDescription('Crear una nueva notificación', [PermisoEnum.NOTIFICACIONES_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseNotificacionType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'notificaciones',
    tabla: 'Notificacion',
    descripcion: 'Crear nueva notificación',
  })
  create(@Body() inputDto: CreateNotificacionDto, @AuthUser() session: IToken) {
    return this.notificacionService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiDescription('Listar todas las notificaciones', [PermisoEnum.NOTIFICACIONES_VER])
  @ApiResponse({ status: 200, type: ResponseNotificacionesType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.notificacionService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiDescription('Servicio post con filtros y paginado de notificaciones', [
    PermisoEnum.NOTIFICACIONES_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateNotificacionesType })
  list(@Body() inputDto: ListNotificacionArgsDto) {
    return this.notificacionService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiResponse({ status: 200, type: () => ResponseNotificacionDetailType })
  @ApiDescription('Obtener una notificación por ID', [PermisoEnum.NOTIFICACIONES_VER])
  findOne(@Param('id') id: string) {
    return this.notificacionService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseNotificacionType })
  @ApiDescription('Actualizar una notificación por ID', [PermisoEnum.NOTIFICACIONES_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'notificaciones',
    tabla: 'Notificacion',
    descripcion: 'Actualizar notificación',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificacionDto,
    @AuthUser() session: IToken,
  ) {
    return this.notificacionService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseNotificacionType })
  @ApiDescription('Eliminar una notificación por ID', [PermisoEnum.NOTIFICACIONES_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'notificaciones',
    tabla: 'Notificacion',
    descripcion: 'Eliminar notificación',
  })
  remove(@Param('id') id: string) {
    return this.notificacionService.remove(id);
  }

  // ==================== CUSTOM ENDPOINTS ====================

  @Get('user/no-leidas')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiDescription('Obtener notificaciones no leídas del usuario actual', [
    PermisoEnum.NOTIFICACIONES_VER,
  ])
  @ApiResponse({ status: 200, type: () => ResponseNotificacionesType })
  getUnread(@AuthUser() session: IToken) {
    return this.notificacionService.findUnreadByUser(session.usuarioId);
  }

  @Get('user/contador')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiDescription('Contar notificaciones no leídas del usuario', [PermisoEnum.NOTIFICACIONES_VER])
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  countUnread(@AuthUser() session: IToken) {
    return this.notificacionService.countUnreadByUser(session.usuarioId);
  }

  @Patch(':id/marcar-leida')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiDescription('Marcar notificación como leída', [PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseNotificacionType })
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'notificaciones',
    tabla: 'Notificacion',
    descripcion: 'Marcar notificación como leída',
  })
  markAsRead(@Param('id') id: string) {
    return this.notificacionService.markAsRead(id);
  }

  @Patch('user/marcar-todas-leidas')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiDescription('Marcar todas las notificaciones como leídas', [
    PermisoEnum.NOTIFICACIONES_EDITAR,
  ])
  @ApiResponse({ status: 200 })
  markAllAsRead(@AuthUser() session: IToken) {
    return this.notificacionService.markAllAsReadByUser(session.usuarioId);
  }

  @Delete('user/limpiar-leidas')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_ELIMINAR])
  @ApiDescription('Limpiar notificaciones leídas del usuario', [
    PermisoEnum.NOTIFICACIONES_ELIMINAR,
  ])
  @ApiResponse({ status: 200 })
  clearRead(@AuthUser() session: IToken) {
    return this.notificacionService.clearReadByUser(session.usuarioId);
  }
}
