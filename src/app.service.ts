import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ResponseDTO } from './common/dtos';
import dayjs from 'dayjs';
import { PrismaService } from './global/database/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Devuelve información esencial de servicio.
   * @returns
   */
  getPing(): ResponseDTO<{
    author: string;
    dateTimeServer: Date;
    nameApp: string;
    version: string;
  }> {
    const packageJson = this.configService.get<any>('packageJson');
    return {
      error: false,
      message: packageJson?.description,
      response: {
        data: {
          author: packageJson.author,
          dateTimeServer: dayjs().toDate(),
          nameApp: packageJson?.name,
          version: packageJson?.version,
        },
      },
      status: 200,
    };
  }

  /**
   * Verifica el estado de salud del servicio, incluyendo conexión a la base de datos.
   * @returns
   */
  async getHealth(): Promise<
    ResponseDTO<{
      status: string;
      database: boolean;
      timestamp: Date;
    }>
  > {
    const isDbConnected = await this.prismaService.checkConnection();
    const overallStatus = isDbConnected ? 'healthy' : 'unhealthy';

    return {
      error: !isDbConnected,
      message: isDbConnected
        ? 'Servicio operativo conexion exitosa'
        : 'Problema con la conexión a la base de datos',
      response: {
        data: {
          status: overallStatus,
          database: isDbConnected,
          timestamp: dayjs().toDate(),
        },
      },
      status: isDbConnected ? 200 : 503, // 503 Service Unavailable si DB falla
    };
  }
}
