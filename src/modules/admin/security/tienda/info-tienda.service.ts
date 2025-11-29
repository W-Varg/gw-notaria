import { Injectable } from '@nestjs/common';
import { UpdateInformacionTiendaDto } from './dto/info-tienda.input.dto';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { InformacionTienda } from './info-tienda.entity';

@Injectable()
export class InformacionTiendaService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne() {
    const item = await this.prismaService.informacionTienda.findFirst({
      where: { estaActivo: true },
    });

    if (!item) return dataResponseError('Información de tienda no encontrada');

    return dataResponseSuccess<InformacionTienda>({ data: item });
  }

  async update(updateInformacionTiendaDto: UpdateInformacionTiendaDto) {
    const exists = await this.prismaService.informacionTienda.findFirst({
      select: { id: true },
    });

    if (!exists) return dataResponseError('Información de tienda no encontrada');

    const result = await this.prismaService.informacionTienda.update({
      where: { id: exists.id },
      data: updateInformacionTiendaDto,
    });

    return dataResponseSuccess<InformacionTienda>({ data: result });
  }
}
