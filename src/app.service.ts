import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ResponseDTO } from './common/dtos';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

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
}
