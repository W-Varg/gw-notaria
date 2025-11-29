import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PermisosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActivos() {
    return this.prisma.permiso.findMany({ where: { estaActivo: true } });
  }

  async findAllInactivos() {
    return this.prisma.permiso.findMany({ where: { estaActivo: false } });
  }

  async setActivo(id: number, activo: boolean) {
    return this.prisma.permiso.update({ where: { id }, data: { estaActivo: activo } });
  }

  async findById(id: number) {
    return this.prisma.permiso.findUnique({ where: { id } });
  }
}
