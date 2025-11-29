import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CategoriaPublica, SucursalPublica } from './dto/public.response';

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

  getSucursales(): Promise<SucursalPublica[]> {
    return this.prisma.sucursal.findMany({
      where: { estaActiva: true },
      select: {
        id: true,
        nombre: true,
        ciudad: true,
        direccion: true,
        telefono: true,
        latitud: true,
        longitud: true,
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

  async topResenias(cantidad: number) {
    // los ultimos  mejor calificados
    return this.prisma.resenia.findMany({
      where: { puntuacion: { gte: 3 }, estaAprobada: true },
      orderBy: [{ puntuacion: 'desc' }, { fechaCreacion: 'desc' }],
      take: cantidad,
      select: {
        id: true,
        usuario: {
          select: { nombre: true, apellidos: true },
        },
        comentario: true,
        puntuacion: true,
        fechaCreacion: true,
      },
    });
  }
}
