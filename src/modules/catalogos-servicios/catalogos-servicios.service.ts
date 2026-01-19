import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';

@Injectable()
export class CatalogosServiciosService {
  constructor(private readonly prismaService: PrismaService) {}
  get() {
    return this.prismaService.catalogoServicio.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        descripcion: true,
        precioBase: true,
        tarifaVariable: true,
      },
    });
  }
}
