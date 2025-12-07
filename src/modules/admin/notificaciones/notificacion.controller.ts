import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacionService } from './notificacion.service';
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  ListNotificacionArgsDto,
} from './dto/notificacion.input.dto';
import {
  ResponseNotificacionType,
  ResponseNotificacionDetailType,
  PaginateNotificacionesType,
  ResponseDeleteNotificacionType,
} from './dto/notificacion.response';
import { Notificacion, NotificacionDetail } from './notificacion.entity';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';

@ApiTags('[admin] Notificaciones')
@Controller('notificaciones')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  // ==================== CREATE ====================
  @Post()
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_CREAR])
  @ApiOperation({
    summary: 'Crear notificación',
    description: 'Crea una nueva notificación en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Notificación creada exitosamente',
    type: ResponseNotificacionType,
  })
  async create(@Body() createDto: CreateNotificacionDto) {
    const notificacion = await this.notificacionService.create(createDto);

    return {
      status: 'success',
      message: 'Notificación creada correctamente',
      data: notificacion,
    };
  }

  // ==================== FIND ALL (Simple) ====================
  @Get()
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiOperation({
    summary: 'Listar notificaciones',
    description: 'Obtiene todas las notificaciones del usuario actual',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de notificaciones',
    type: [Notificacion],
  })
  async findAll(@Request() req) {
    const usuarioId = req.user.id;
    const notificaciones = await this.notificacionService.findUnreadByUser(usuarioId);

    return notificaciones;
  }

  // ==================== FIND ALL (Paginated) ====================
  @Post('list')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiOperation({
    summary: 'Listar notificaciones (paginado)',
    description: 'Obtiene notificaciones con filtros, paginación y ordenamiento',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista paginada de notificaciones',
    type: PaginateNotificacionesType,
  })
  async findAllPaginated(@Body() listArgs: ListNotificacionArgsDto) {
    const result = await this.notificacionService.findAll(listArgs);

    return {
      status: 'success',
      message: 'Notificaciones obtenidas correctamente',
      data: result,
    };
  }

  // ==================== FIND ONE ====================
  @Get(':id')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiOperation({
    summary: 'Obtener notificación por ID',
    description: 'Obtiene el detalle completo de una notificación',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle de la notificación',
    type: ResponseNotificacionDetailType,
  })
  async findOne(@Param('id') id: string) {
    const notificacion = await this.notificacionService.findOne(id);

    return {
      status: 'success',
      message: 'Notificación obtenida correctamente',
      data: notificacion,
    };
  }

  // ==================== UPDATE ====================
  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiOperation({
    summary: 'Actualizar notificación',
    description: 'Actualiza los datos de una notificación existente',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notificación actualizada exitosamente',
    type: ResponseNotificacionType,
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateNotificacionDto) {
    const notificacion = await this.notificacionService.update(id, updateDto);

    return {
      status: 'success',
      message: 'Notificación actualizada correctamente',
      data: notificacion,
    };
  }

  // ==================== DELETE ====================
  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_ELIMINAR])
  @ApiOperation({
    summary: 'Eliminar notificación',
    description: 'Elimina una notificación del sistema',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notificación eliminada exitosamente',
    type: ResponseDeleteNotificacionType,
  })
  async remove(@Param('id') id: string) {
    await this.notificacionService.remove(id);

    return {
      status: 'success',
      message: 'Notificación eliminada correctamente',
    };
  }

  // ==================== CUSTOM ENDPOINTS ====================

  // Obtener notificaciones no leídas
  @Get('user/no-leidas')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiOperation({
    summary: 'Obtener notificaciones no leídas',
    description: 'Obtiene todas las notificaciones no leídas del usuario actual',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de notificaciones no leídas',
    type: [Notificacion],
  })
  async getUnread(@Request() req) {
    const usuarioId = req.user.id;
    const notificaciones = await this.notificacionService.findUnreadByUser(usuarioId);

    return notificaciones;
  }

  // Contador de notificaciones no leídas
  @Get('user/contador')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_VER])
  @ApiOperation({
    summary: 'Contar notificaciones no leídas',
    description: 'Obtiene el número de notificaciones no leídas del usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contador de notificaciones no leídas',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  async countUnread(@Request() req) {
    const usuarioId = req.user.id;
    return await this.notificacionService.countUnreadByUser(usuarioId);
  }

  // Marcar notificación como leída
  @Patch(':id/marcar-leida')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiOperation({
    summary: 'Marcar notificación como leída',
    description: 'Marca una notificación específica como leída',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notificación marcada como leída',
  })
  async markAsRead(@Param('id') id: string) {
    const result = await this.notificacionService.markAsRead(id);

    return {
      status: 'success',
      message: result.message,
    };
  }

  // Marcar todas como leídas
  @Patch('user/marcar-todas-leidas')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_EDITAR])
  @ApiOperation({
    summary: 'Marcar todas las notificaciones como leídas',
    description: 'Marca todas las notificaciones no leídas del usuario como leídas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todas las notificaciones marcadas como leídas',
  })
  async markAllAsRead(@Request() req) {
    const usuarioId = req.user.id;
    const result = await this.notificacionService.markAllAsReadByUser(usuarioId);

    return {
      status: 'success',
      message: result.message,
      data: { count: result.count },
    };
  }

  // Limpiar notificaciones leídas
  @Delete('user/limpiar-leidas')
  @BearerAuthPermision([PermisoEnum.NOTIFICACIONES_ELIMINAR])
  @ApiOperation({
    summary: 'Limpiar notificaciones leídas',
    description: 'Elimina todas las notificaciones leídas del usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notificaciones leídas eliminadas',
  })
  async clearRead(@Request() req) {
    const usuarioId = req.user.id;
    const result = await this.notificacionService.clearReadByUser(usuarioId);

    return {
      status: 'success',
      message: result.message,
      data: { count: result.count },
    };
  }
}
