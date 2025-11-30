import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import { CategoriaPublica } from './dto/public.response';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  getCategorias(): Promise<CategoriaPublica[]> {
    return this.prisma.categoria.findMany({
      where: { estaActiva: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagen: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  getTiposProductos(): Promise<{ id: string; nombre: string }[]> {
    return this.prisma.tipoProducto.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
