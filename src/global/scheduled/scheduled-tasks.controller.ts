import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserCleanupService } from './user-cleanup.service';
import { ApiDescription } from '../../common/decorators/controller.decorator';
import { BearerAuthPermision } from '../../common/decorators/authorization.decorator';
import { PermisoEnum } from '../../enums/permisos.enum';

@ApiTags('[scheduled-tasks] Tareas Programadas')
@Controller('scheduled-tasks')
export class ScheduledTasksController {
  constructor(private readonly userCleanupService: UserCleanupService) {}

  @Post('cleanup-unverified-users')
  @BearerAuthPermision([PermisoEnum.ELIMINAR_USUARIOS_NO_VERIFICADOS])
  @ApiDescription('Ejecutar manualmente la limpieza de usuarios no verificados', [])
  @ApiResponse({ status: 200, description: 'Limpieza ejecutada exitosamente' })
  async cleanupUnverifiedUsers() {
    return this.userCleanupService.executeCleanupManually();
  }
}
