import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  EstadisticasGeneralesResponse,
  VentasPorDiaResponse,
  VentasPorCategoriaResponse,
  TopProductosResponse,
  PedidosPendientesResponse,
  ClientesRecientesResponse,
  ProductosStockBajoResponse,
  ResumenEstadoPedidosResponse,
  VentaPorDiaItem,
  VentaPorCategoriaItem,
  ProductoTopItem,
  PedidoPendienteItem,
  ClienteRecienteItem,
  ProductoStockBajoItem,
  EstadoPedidosItem,
} from './dto/dashboard.response';
import {
  PeriodoQueryDto,
  TopProductosQueryDto,
  ClientesRecientesQueryDto,
} from './dto/dashboard.input.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener estadísticas generales del dashboard
   */
  async getEstadisticasGenerales(params: PeriodoQueryDto): Promise<EstadisticasGeneralesResponse> {
    const { fechaInicio, fechaFin, sucursalId } = params;

    // Calcular fechas por defecto (últimos 30 días)
    const fechaFinDate = fechaFin ? new Date(fechaFin) : new Date();
    const fechaInicioDate = fechaInicio
      ? new Date(fechaInicio)
      : new Date(new Date().setDate(fechaFinDate.getDate() - 30));

    // Construir where clause
    const whereClause: any = {
      fechaCreacion: {
        gte: fechaInicioDate,
        lte: fechaFinDate,
      },
    };

    if (sucursalId) {
      whereClause.sucursalId = sucursalId;
    }

    // Total de pedidos y monto
    const pedidos = await this.prisma.pedido.findMany({
      where: whereClause,
      select: {
        montoTotal: true,
      },
    });

    const totalPedidos = pedidos.length;
    const montoTotalVendido = pedidos.reduce((sum, p) => sum + p.montoTotal, 0);

    // Total de clientes
    const totalClientes = await this.prisma.usuario.count({
      where: {
        empleado: null, // Solo clientes, no empleados
      },
    });

    // Promedio de venta
    const promedioVentaPorPedido = totalPedidos > 0 ? montoTotalVendido / totalPedidos : 0;

    // Calcular tasa de crecimiento (período anterior)
    const diasPeriodo = Math.ceil(
      (fechaFinDate.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const fechaInicioAnterior = new Date(
      fechaInicioDate.getTime() - diasPeriodo * 24 * 60 * 60 * 1000,
    );

    const pedidosAnteriores = await this.prisma.pedido.findMany({
      where: {
        fechaCreacion: {
          gte: fechaInicioAnterior,
          lt: fechaInicioDate,
        },
        ...(sucursalId && { sucursalId }),
      },
      select: {
        montoTotal: true,
      },
    });

    const montoAnterior = pedidosAnteriores.reduce((sum, p) => sum + p.montoTotal, 0);
    const tasaCrecimiento =
      montoAnterior > 0 ? ((montoTotalVendido - montoAnterior) / montoAnterior) * 100 : 0;

    return {
      totalVentas: totalPedidos,
      montoTotalVendido,
      totalPedidos,
      totalClientes,
      promedioVentaPorPedido,
      tasaCrecimiento,
    };
  }

  /**
   * Obtener ventas por día
   */
  async getVentasPorDia(params: PeriodoQueryDto): Promise<VentasPorDiaResponse> {
    const { fechaInicio, fechaFin, sucursalId } = params;

    const fechaFinDate = fechaFin ? new Date(fechaFin) : new Date();
    const fechaInicioDate = fechaInicio
      ? new Date(fechaInicio)
      : new Date(new Date().setDate(fechaFinDate.getDate() - 30));

    const pedidos = await this.prisma.pedido.findMany({
      where: {
        fechaCreacion: {
          gte: fechaInicioDate,
          lte: fechaFinDate,
        },
        ...(sucursalId && { sucursalId }),
      },
      select: {
        fechaCreacion: true,
        montoTotal: true,
      },
      orderBy: {
        fechaCreacion: 'asc',
      },
    });

    // Agrupar por día
    const ventasPorDia = new Map<string, { monto: number; cantidad: number }>();

    for (const pedido of pedidos) {
      const fecha = pedido.fechaCreacion.toISOString().split('T')[0];
      const actual = ventasPorDia.get(fecha) || { monto: 0, cantidad: 0 };
      ventasPorDia.set(fecha, {
        monto: actual.monto + pedido.montoTotal,
        cantidad: actual.cantidad + 1,
      });
    }

    const ventas: VentaPorDiaItem[] = Array.from(ventasPorDia.entries()).map(([fecha, data]) => ({
      fecha,
      monto: data.monto,
      cantidadPedidos: data.cantidad,
    }));

    return { ventas };
  }

  /**
   * Obtener ventas por categoría
   */
  async getVentasPorCategoria(params: PeriodoQueryDto): Promise<VentasPorCategoriaResponse> {
    const { fechaInicio, fechaFin, sucursalId } = params;

    const fechaFinDate = fechaFin ? new Date(fechaFin) : new Date();
    const fechaInicioDate = fechaInicio
      ? new Date(fechaInicio)
      : new Date(new Date().setDate(fechaFinDate.getDate() - 30));

    const items = await this.prisma.itemPedido.findMany({
      where: {
        pedido: {
          fechaCreacion: {
            gte: fechaInicioDate,
            lte: fechaFinDate,
          },
          ...(sucursalId && { sucursalId }),
        },
      },
      include: {
        producto: {
          include: {
            categoria: true,
          },
        },
      },
    });

    // Agrupar por categoría
    const ventasPorCategoria = new Map<
      string,
      { categoriaId: string; categoria: string; monto: number; cantidad: number }
    >();

    for (const item of items) {
      const categoriaId = item.producto.categoriaId;
      const categoria = item.producto.categoria.nombre;
      const actual = ventasPorCategoria.get(categoriaId) || {
        categoriaId,
        categoria,
        monto: 0,
        cantidad: 0,
      };

      ventasPorCategoria.set(categoriaId, {
        ...actual,
        monto: actual.monto + item.subtotal,
        cantidad: actual.cantidad + item.cantidad,
      });
    }

    const totalMonto = Array.from(ventasPorCategoria.values()).reduce((sum, v) => sum + v.monto, 0);

    const ventas: VentaPorCategoriaItem[] = Array.from(ventasPorCategoria.values())
      .map((v) => ({
        ...v,
        porcentaje: totalMonto > 0 ? (v.monto / totalMonto) * 100 : 0,
      }))
      .sort((a, b) => b.monto - a.monto);

    return { ventas };
  }

  /**
   * Obtener top productos más vendidos
   */
  async getTopProductos(params: TopProductosQueryDto): Promise<TopProductosResponse> {
    const { fechaInicio, fechaFin, sucursalId, limite = 10 } = params;

    const fechaFinDate = fechaFin ? new Date(fechaFin) : new Date();
    const fechaInicioDate = fechaInicio
      ? new Date(fechaInicio)
      : new Date(new Date().setDate(fechaFinDate.getDate() - 30));

    const items = await this.prisma.itemPedido.findMany({
      where: {
        pedido: {
          fechaCreacion: {
            gte: fechaInicioDate,
            lte: fechaFinDate,
          },
          ...(sucursalId && { sucursalId }),
        },
      },
      include: {
        producto: {
          include: {
            categoria: true,
            imagenes: {
              where: { esPrincipal: true },
              take: 1,
            },
          },
        },
      },
    });

    // Agrupar por producto
    const productoMap = new Map<
      string,
      {
        productoId: string;
        nombre: string;
        cantidadVendida: number;
        montoTotal: number;
        imagen?: string;
        categoria: string;
      }
    >();

    for (const item of items) {
      const productoId = item.productoId;
      const actual = productoMap.get(productoId);

      if (actual) {
        actual.cantidadVendida += item.cantidad;
        actual.montoTotal += item.subtotal;
      } else {
        productoMap.set(productoId, {
          productoId,
          nombre: item.producto.nombre,
          cantidadVendida: item.cantidad,
          montoTotal: item.subtotal,
          imagen: item.producto.imagenes[0]?.url,
          categoria: item.producto.categoria.nombre,
        });
      }
    }

    const productos: ProductoTopItem[] = Array.from(productoMap.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, limite);

    return { productos };
  }

  /**
   * Obtener pedidos pendientes de atención
   */
  async getPedidosPendientes(): Promise<PedidosPendientesResponse> {
    const pedidos = await this.prisma.pedido.findMany({
      where: {
        estado: {
          in: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION'],
        },
      },
      include: {
        usuario: true,
        items: true,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
      take: 20,
    });

    const pedidosPendientes: PedidoPendienteItem[] = pedidos.map((p) => ({
      id: p.id,
      numeroPedido: p.numeroPedido,
      cliente: `${p.usuario.nombre} ${p.usuario.apellidos}`,
      estado: p.estado,
      total: p.montoTotal,
      fechaCreacion: p.fechaCreacion,
      cantidadItems: p.items.length,
    }));

    const total = await this.prisma.pedido.count({
      where: {
        estado: {
          in: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION'],
        },
      },
    });

    return {
      pedidos: pedidosPendientes,
      total,
    };
  }

  /**
   * Obtener clientes registrados recientemente
   */
  async getClientesRecientes(
    params: ClientesRecientesQueryDto,
  ): Promise<ClientesRecientesResponse> {
    const { limite = 10 } = params;

    const clientes = await this.prisma.usuario.findMany({
      where: {
        empleado: null,
      },
      include: {
        pedidos: {
          select: {
            montoTotal: true,
          },
        },
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
      take: limite,
    });

    const clientesRecientes: ClienteRecienteItem[] = clientes.map((c) => ({
      id: c.id,
      nombre: `${c.nombre} ${c.apellidos}`,
      email: c.email,
      avatar: c.avatar || undefined,
      fechaRegistro: c.fechaCreacion,
      totalPedidos: c.pedidos.length,
      montoTotalGastado: c.pedidos.reduce((sum, p) => sum + p.montoTotal, 0),
    }));

    return { clientes: clientesRecientes };
  }

  /**
   * Obtener productos con stock bajo
   */
  async getProductosStockBajo(): Promise<ProductosStockBajoResponse> {
    const inventarios = await this.prisma.inventario.findMany({
      where: {
        stock: {
          lte: this.prisma.inventario.fields.stockMinimo,
        },
      },
      include: {
        producto: {
          include: {
            categoria: true,
          },
        },
        sucursal: true,
      },
      orderBy: {
        stock: 'asc',
      },
      take: 20,
    });

    const productos: ProductoStockBajoItem[] = inventarios.map((inv) => ({
      productoId: inv.productoId,
      nombre: inv.producto.nombre,
      sku: inv.producto.codigoSKU,
      stockActual: inv.stock,
      stockMinimo: inv.stockMinimo,
      sucursal: inv.sucursal.nombre,
      categoria: inv.producto.categoria.nombre,
    }));

    return {
      productos,
      total: productos.length,
    };
  }

  /**
   * Obtener resumen de estado de pedidos
   */
  async getResumenEstadoPedidos(params: PeriodoQueryDto): Promise<ResumenEstadoPedidosResponse> {
    const { fechaInicio, fechaFin, sucursalId } = params;

    const fechaFinDate = fechaFin ? new Date(fechaFin) : new Date();
    const fechaInicioDate = fechaInicio
      ? new Date(fechaInicio)
      : new Date(new Date().setDate(fechaFinDate.getDate() - 30));

    const pedidos = await this.prisma.pedido.groupBy({
      by: ['estado'],
      where: {
        fechaCreacion: {
          gte: fechaInicioDate,
          lte: fechaFinDate,
        },
        ...(sucursalId && { sucursalId }),
      },
      _count: {
        id: true,
      },
      _sum: {
        montoTotal: true,
      },
    });

    const estados: EstadoPedidosItem[] = pedidos.map((p) => ({
      estado: p.estado,
      cantidad: p._count.id,
      monto: p._sum.montoTotal || 0,
    }));

    return { estados };
  }
}
