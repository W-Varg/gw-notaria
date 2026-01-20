import { BadRequestException, Injectable } from '@nestjs/common';
import { CrearVentaInput } from './dto/crear-venta.input';
import { PrismaService } from 'src/global/database/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { dataResponseSuccess, ListFindAllQueryDto } from 'src/common/dtos';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';

@Injectable()
export class VentasServiciosService {
  constructor(private readonly _prismaService: PrismaService) {}

  crearVenta(dto: CrearVentaInput, userCreateId: string) {
    if (!dto.detalles || dto.detalles.length === 0) {
      throw new BadRequestException('La venta debe tener al menos un detalle');
    }

    return this._prismaService.$transaction(async (tx) => {
      let total = new Prisma.Decimal(0);
      let descuento = new Prisma.Decimal(0);

      const detallesProcesados: {
        catalogoServicioId: string;
        cantidad: number;
        precioUnitario: Prisma.Decimal;
        precioCatalogo: Prisma.Decimal;
        subtotal: Prisma.Decimal;
        descuento?: Prisma.Decimal;
        userCreateId: string;
      }[] = [];

      for (const item of dto.detalles) {
        const servicio = await tx.catalogoServicio.findUnique({
          where: { id: item.servicioId },
        });

        if (!servicio) {
          throw new BadRequestException(`Servicio ${item.servicioId} no existe`);
        }

        let precioUnitario = servicio.precioBase;
        const precioCatalogo = servicio.precioBase;

        if (servicio.tarifaVariable) {
          if (item.precio == null) {
            throw new BadRequestException(`El servicio ${item.servicioId} requiere precio`);
          }

          precioUnitario = new Prisma.Decimal(item.precio);
        }

        const subtotal = precioUnitario.mul(item.cantidad);
        total = total.add(subtotal);

        const descuentoMonto = subtotal.mul(new Prisma.Decimal(item.descuento).div(100));
        descuento = descuento.add(descuentoMonto);

        detallesProcesados.push({
          catalogoServicioId: item.servicioId,
          cantidad: item.cantidad,
          precioUnitario: precioUnitario,
          precioCatalogo,
          subtotal,
          descuento: descuentoMonto,
          userCreateId,
        });
      }

      let numeroTransaccion: string;

      if (dto.tipoComprobante === 'RECIBO') {
        numeroTransaccion = await this.generarNumeroRecibo(tx);
      }

      const venta = await tx.ventaServicio.create({
        data: {
          tipoTransaccion: dto.tipoComprobante,
          numeroTransaccion,
          clienteId: dto.clienteId,
          total: total.minus(descuento),
          userCreateId: userCreateId,
          detalles: {
            createMany: {
              data: detallesProcesados,
            },
          },
        },
      });

      return venta;
    });
  }

  async findOne(id: string) {
    return this._prismaService.ventaServicio.findUnique({
      where: { id },
      include: {
        detalles: {
          select: {
            id: true,
            catalogoServicio: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                precioBase: true,
                tarifaVariable: true,
              },
            },
            cantidad: true,
            precioUnitario: true,
            precioCatalogo: true,
            subtotal: true,
            descuento: true,
            codigoActividadSin: true,
          },
        },
      },
    });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this._prismaService.ventaServicio.findMany({
        include: {
          detalles: {
            select: {
              id: true,
              catalogoServicioId: true,
              cantidad: true,
              precioUnitario: true,
              precioCatalogo: true,
              subtotal: true,
              descuento: true,
              codigoActividadSin: true,
            },
          },
        },
        skip,
        take,
        orderBy,
      }),
      pagination ? this._prismaService.ventaServicio.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess({
      data: list,
      pagination,
    });
  }

  async generarNumeroRecibo(tx: Prisma.TransactionClient): Promise<string> {
    const secuencia = await tx.secuencia.findFirst();

    const secuentiaNueva = await tx.secuencia.upsert({
      where: { id: secuencia?.id ?? -1 },
      update: {
        numeroRecibo: { increment: 1 },
      },
      create: {
        numeroRecibo: 1,
      },
    });

    return secuentiaNueva.numeroRecibo.toString().padStart(6, '0');
  }
}
