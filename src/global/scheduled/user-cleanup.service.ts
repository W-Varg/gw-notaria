import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/global/database/prisma.service';

@Injectable()
export class UserCleanupService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Tarea programada que se ejecuta cada hora para eliminar usuarios no verificados
   * Se ejecuta a las 00 minutos de cada hora
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupUnverifiedUsers(): Promise<void> {
    Logger.log('Iniciando limpieza de usuarios no verificados...');

    try {
      // Calcular la fecha límite (24 horas atrás)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Buscar usuarios no verificados creados hace más de 24 horas
      const unverifiedUsers = await this.prismaService.usuario.findMany({
        where: { emailVerificado: false, fechaCreacion: { lt: twentyFourHoursAgo } },
        select: { id: true, email: true, fechaCreacion: true },
      });

      if (unverifiedUsers.length === 0) {
        Logger.log('No hay usuarios no verificados para eliminar');
        return;
      }

      Logger.log(`Se encontraron ${unverifiedUsers.length} usuarios no verificados para eliminar`);

      // Eliminar tokens de verificación asociados
      const userIds = unverifiedUsers.map((user) => user.id);
      const tokenKeys = userIds.map((id) => `verify_token_${id}`);

      await this.prismaService.configuracionSistema.deleteMany({
        where: {
          clave: {
            in: tokenKeys,
          },
        },
      });

      // Eliminar usuarios no verificados
      const result = await this.prismaService.usuario.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      Logger.log(`Se eliminaron ${result.count} usuarios no verificados exitosamente`);

      // Log de cada usuario eliminado (para auditoría)
      unverifiedUsers.forEach((user) => {
        Logger.debug(
          `Usuario eliminado: ${user.email} (Creado: ${user.fechaCreacion.toISOString()})`,
        );
      });
    } catch (error) {
      Logger.error('Error al limpiar usuarios no verificados:', error.message);
      Logger.error(error.stack);
    }
  }

  /**
   * Método manual para ejecutar la limpieza (útil para testing o ejecución manual)
   */
  async executeCleanupManually(): Promise<{ deleted: number; message: string }> {
    Logger.log('Ejecución manual de limpieza de usuarios no verificados');

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const unverifiedUsers = await this.prismaService.usuario.findMany({
      where: {
        emailVerificado: false,
        fechaCreacion: {
          lt: twentyFourHoursAgo,
        },
      },
      select: {
        id: true,
      },
    });

    if (unverifiedUsers.length === 0) {
      return {
        deleted: 0,
        message: 'No hay usuarios no verificados para eliminar',
      };
    }

    const userIds = unverifiedUsers.map((user) => user.id);
    const tokenKeys = userIds.map((id) => `verify_token_${id}`);

    await this.prismaService.configuracionSistema.deleteMany({
      where: {
        clave: {
          in: tokenKeys,
        },
      },
    });

    const result = await this.prismaService.usuario.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return {
      deleted: result.count,
      message: `Se eliminaron ${result.count} usuarios no verificados`,
    };
  }
}
