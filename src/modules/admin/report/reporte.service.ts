import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Response } from 'express';
import {
  ReporteVentasDto,
  ReporteInventarioDto,
  ReporteClientesDto,
  ReporteProductosDto,
  ReportePedidosDto,
  ReporteEntregasDto,
} from './dto/reporte.input.dto';
import { ReportExportHelper } from './helpers/report-export.helper';

@Injectable()
export class ReporteService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Generar reporte de ventas
   * @param dto parámetros del reporte
   * @returns reporte de ventas
   */
  async reporteVentas(dto: ReporteVentasDto) {
    try {
      const whereCondition: any = {
        estado: 'ENTREGADO',
      };

      if (dto.fechaInicio || dto.fechaFin) {
        whereCondition.fechaCreacion = {};
        if (dto.fechaInicio) {
          whereCondition.fechaCreacion.gte = new Date(dto.fechaInicio);
        }
        if (dto.fechaFin) {
          whereCondition.fechaCreacion.lte = new Date(dto.fechaFin);
        }
      }

      if (dto.sucursalId) {
        whereCondition.sucursalId = dto.sucursalId;
      }

      const pedidos = await this.prismaService.pedido.findMany({
        where: whereCondition,
        include: {
          items: {
            include: {
              producto: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      const totalVentas = pedidos.reduce(
        (sum, pedido) =>
          sum + pedido.subtotal + pedido.montoImpuestos - pedido.montoDescuento + pedido.montoEnvio,
        0,
      );
      const totalPedidos = pedidos.length;

      const datos = {
        resumen: {
          totalVentas,
          totalPedidos,
          promedioPorPedido: totalPedidos > 0 ? totalVentas / totalPedidos : 0,
          periodo: {
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
          },
        },
        pedidos,
      };

      return dataResponseSuccess({
        data: datos,
      });
    } catch (error) {
      throw new Error(`Error al generar el reporte de ventas: ${error.message}`);
    }
  }

  /**
   * Generar reporte de inventario
   * @param dto parámetros del reporte
   * @returns reporte de inventario
   */
  async reporteInventario(dto: ReporteInventarioDto) {
    try {
      const whereCondition: any = {};

      if (dto.sucursalId) {
        whereCondition.sucursalId = dto.sucursalId;
      }

      const inventarios = await this.prismaService.inventario.findMany({
        where: whereCondition,
        include: {
          producto: {
            include: {
              categoria: true,
            },
          },
          sucursal: true,
        },
      });

      // Filtrar por categoría si se especifica
      let inventariosFiltrados = inventarios;
      if (dto.categoriaId) {
        inventariosFiltrados = inventarios.filter(
          (inv) => inv.producto.categoriaId === dto.categoriaId,
        );
      }

      const productosBajoStock = inventariosFiltrados.filter((inv) => inv.stock <= inv.stockMinimo);

      const datos = {
        resumen: {
          totalProductos: inventariosFiltrados.length,
          productosBajoStock: productosBajoStock.length,
          valorTotalInventario: inventariosFiltrados.reduce(
            (sum, inv) => sum + inv.stock * inv.producto.precio,
            0,
          ),
        },
        inventarios: inventariosFiltrados,
        productosBajoStock,
      };

      return dataResponseSuccess({
        data: datos,
      });
    } catch (error) {
      throw new Error(`Error al generar el reporte de inventario: ${error.message}`);
    }
  }

  /**
   * Generar reporte de clientes
   * @param dto parámetros del reporte
   * @returns reporte de clientes
   */
  async reporteClientes(dto: ReporteClientesDto) {
    try {
      const usuarios = await this.prismaService.usuario.findMany({
        include: {
          pedidos: {
            where: {
              estado: 'ENTREGADO',
              ...(dto.fechaInicio || dto.fechaFin
                ? {
                    fechaCreacion: {
                      ...(dto.fechaInicio && { gte: new Date(dto.fechaInicio) }),
                      ...(dto.fechaFin && { lte: new Date(dto.fechaFin) }),
                    },
                  }
                : {}),
            },
          },
          _count: {
            select: {
              pedidos: true,
            },
          },
        },
      });

      const clientesConPedidos = usuarios.filter((u) => u.pedidos.length > 0);

      const datos = {
        resumen: {
          totalUsuarios: usuarios.length,
          clientesActivos: clientesConPedidos.length,
          totalPedidos: clientesConPedidos.reduce((sum, u) => sum + u.pedidos.length, 0),
        },
        clientes: clientesConPedidos,
      };

      return dataResponseSuccess({
        data: datos,
      });
    } catch (error) {
      throw new Error(`Error al generar el reporte de clientes: ${error.message}`);
    }
  }

  /**
   * Generar reporte de productos
   * @param dto parámetros del reporte
   * @returns reporte de productos
   */
  async reporteProductos(dto: ReporteProductosDto) {
    try {
      const whereCondition: any = {};

      if (dto.categoriaId) {
        whereCondition.categoriaId = dto.categoriaId;
      }

      if (dto.tipoProductoId) {
        whereCondition.tipoProductoId = dto.tipoProductoId;
      }

      const productos = await this.prismaService.producto.findMany({
        where: whereCondition,
        include: {
          categoria: true,
          tipo: true,
          inventarios: {
            include: {
              sucursal: true,
            },
          },
          _count: {
            select: {
              itemsPedido: true,
            },
          },
        },
      });

      const productosMasVendidos = productos
        .toSorted((a, b) => b._count.itemsPedido - a._count.itemsPedido)
        .slice(0, 10);

      const datos = {
        resumen: {
          totalProductos: productos.length,
          productosActivos: productos.filter((p) => p.estaActivo).length,
          productosMasVendidos: productosMasVendidos.length,
        },
        productos,
        productosMasVendidos,
      };

      return dataResponseSuccess({
        data: datos,
      });
    } catch (error) {
      throw new Error(`Error al generar el reporte de productos: ${error.message}`);
    }
  }

  /**
   * Generar reporte de pedidos
   * @param dto parámetros del reporte
   * @returns reporte de pedidos
   */
  async reportePedidos(dto: ReportePedidosDto) {
    try {
      const whereCondition: any = {};

      if (dto.fechaInicio || dto.fechaFin) {
        whereCondition.fechaCreacion = {};
        if (dto.fechaInicio) {
          whereCondition.fechaCreacion.gte = new Date(dto.fechaInicio);
        }
        if (dto.fechaFin) {
          whereCondition.fechaCreacion.lte = new Date(dto.fechaFin);
        }
      }

      if (dto.sucursalId) {
        whereCondition.sucursalId = dto.sucursalId;
      }

      if (dto.estado) {
        whereCondition.estado = dto.estado;
      }

      const pedidos = await this.prismaService.pedido.findMany({
        where: whereCondition,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          items: {
            include: {
              producto: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      const pedidosPorEstado = pedidos.reduce((acc, pedido) => {
        acc[pedido.estado] = (acc[pedido.estado] || 0) + 1;
        return acc;
      }, {});

      const totalIngresos = pedidos
        .filter((p) => p.estado === 'ENTREGADO')
        .reduce(
          (sum, pedido) =>
            sum +
            pedido.subtotal +
            pedido.montoImpuestos -
            pedido.montoDescuento +
            pedido.montoEnvio,
          0,
        );

      const datos = {
        resumen: {
          totalPedidos: pedidos.length,
          pedidosPorEstado,
          totalIngresos,
          periodo: {
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
          },
        },
        pedidos,
      };

      return dataResponseSuccess({
        data: datos,
      });
    } catch (error) {
      throw new Error(`Error al generar el reporte de pedidos: ${error.message}`);
    }
  }

  /**
   * Generar reporte de entregas
   * @param dto parámetros del reporte
   * @returns reporte de entregas
   */
  async reporteEntregas(dto: ReporteEntregasDto) {
    try {
      const whereCondition: any = {};

      if (dto.fechaInicio || dto.fechaFin) {
        whereCondition.fechaCreacion = {};
        if (dto.fechaInicio) {
          whereCondition.fechaCreacion.gte = new Date(dto.fechaInicio);
        }
        if (dto.fechaFin) {
          whereCondition.fechaCreacion.lte = new Date(dto.fechaFin);
        }
      }

      if (dto.sucursalId) {
        whereCondition.sucursalId = dto.sucursalId;
      }

      if (dto.estado) {
        whereCondition.estado = dto.estado;
      }

      const entregas = await this.prismaService.entrega.findMany({
        where: whereCondition,
        include: {
          pedido: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  email: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      const entregasPorEstado = entregas.reduce((acc, entrega) => {
        acc[entrega.estado] = (acc[entrega.estado] || 0) + 1;
        return acc;
      }, {});

      const datos = {
        resumen: {
          totalEntregas: entregas.length,
          entregasPorEstado,
          periodo: {
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
          },
        },
        entregas,
      };

      return dataResponseSuccess({
        data: datos,
      });
    } catch (error) {
      throw new Error(`Error al generar el reporte de entregas: ${error.message}`);
    }
  }

  /**
   * Exportar reporte de ventas a PDF
   */
  async reporteVentasPDF(dto: ReporteVentasDto, res: Response) {
    try {
      const data = await this.reporteVentas(dto);
      const { resumen, pedidos } = data.response.data;

      await ReportExportHelper.generatePDF(
        res,
        'Reporte de Ventas',
        resumen,
        pedidos,
        `reporte-ventas-${new Date().getTime()}.pdf`,
      );
    } catch (error) {
      console.error('Error generando PDF de ventas:', error);
      res.status(500).json({
        error: true,
        message: `Error generando el reporte PDF: ${error.message}`,
        response: null,
        status: 500,
      });
    }
  }

  /**
   * Exportar reporte de ventas a CSV
   */
  async reporteVentasCSV(dto: ReporteVentasDto, res: Response) {
    const data = await this.reporteVentas(dto);
    const { pedidos } = data.response.data;

    const csvData = pedidos.map((pedido) => ({
      numeroPedido: pedido.numeroPedido,
      fecha: new Date(pedido.fechaCreacion).toLocaleDateString('es-ES'),
      cliente: pedido.usuario.nombre,
      email: pedido.usuario.email,
      sucursal: pedido.sucursal.nombre,
      estado: pedido.estado,
      subtotal: pedido.subtotal,
      descuento: pedido.montoDescuento,
      impuestos: pedido.montoImpuestos,
      envio: pedido.montoEnvio,
      total: pedido.montoTotal,
    }));

    const headers = [
      { id: 'numeroPedido', title: 'N° Pedido' },
      { id: 'fecha', title: 'Fecha' },
      { id: 'cliente', title: 'Cliente' },
      { id: 'email', title: 'Email' },
      { id: 'sucursal', title: 'Sucursal' },
      { id: 'estado', title: 'Estado' },
      { id: 'subtotal', title: 'Subtotal' },
      { id: 'descuento', title: 'Descuento' },
      { id: 'impuestos', title: 'Impuestos' },
      { id: 'envio', title: 'Envío' },
      { id: 'total', title: 'Total' },
    ];

    await ReportExportHelper.generateCSV(
      res,
      csvData,
      `reporte-ventas-${new Date().getTime()}.csv`,
      headers,
    );
  }

  /**
   * Exportar reporte de inventario a PDF
   */
  async reporteInventarioPDF(dto: ReporteInventarioDto, res: Response) {
    const data = await this.reporteInventario(dto);
    const { resumen, inventarios } = data.response.data;

    await ReportExportHelper.generatePDF(
      res,
      'Reporte de Inventario',
      resumen,
      inventarios,
      `reporte-inventario-${new Date().getTime()}.pdf`,
    );
  }

  /**
   * Exportar reporte de inventario a CSV
   */
  async reporteInventarioCSV(dto: ReporteInventarioDto, res: Response) {
    const data = await this.reporteInventario(dto);
    const { inventarios } = data.response.data;

    const csvData = inventarios.map((inv) => ({
      producto: inv.producto.nombre,
      categoria: inv.producto.categoria.nombre,
      sku: inv.producto.codigoSKU,
      sucursal: inv.sucursal.nombre,
      stockActual: inv.stock,
      stockMinimo: inv.stockMinimo,
      stockMaximo: inv.stockMaximo,
      cantidadReservado: inv.cantidadReservado,
      precio: inv.producto.precio,
      valorTotal: inv.stock * inv.producto.precio,
    }));

    const headers = [
      { id: 'producto', title: 'Producto' },
      { id: 'categoria', title: 'Categoría' },
      { id: 'sku', title: 'SKU' },
      { id: 'sucursal', title: 'Sucursal' },
      { id: 'stockActual', title: 'Stock Actual' },
      { id: 'stockMinimo', title: 'Stock Mínimo' },
      { id: 'stockMaximo', title: 'Stock Máximo' },
      { id: 'cantidadReservado', title: 'Reservado' },
      { id: 'precio', title: 'Precio' },
      { id: 'valorTotal', title: 'Valor Total' },
    ];

    await ReportExportHelper.generateCSV(
      res,
      csvData,
      `reporte-inventario-${new Date().getTime()}.csv`,
      headers,
    );
  }

  /**
   * Exportar reporte de clientes a PDF
   */
  async reporteClientesPDF(dto: ReporteClientesDto, res: Response) {
    const data = await this.reporteClientes(dto);
    const { resumen, clientes } = data.response.data;

    await ReportExportHelper.generatePDF(
      res,
      'Reporte de Clientes',
      resumen,
      clientes,
      `reporte-clientes-${new Date().getTime()}.pdf`,
    );
  }

  /**
   * Exportar reporte de clientes a CSV
   */
  async reporteClientesCSV(dto: ReporteClientesDto, res: Response) {
    const data = await this.reporteClientes(dto);
    const { clientes } = data.response.data;

    const csvData = clientes.map((cliente) => ({
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono || 'N/A',
      totalPedidos: cliente.pedidos.length,
      activo: cliente.estaActivo ? 'Sí' : 'No',
      fechaRegistro: new Date(cliente.fechaCreacion).toLocaleDateString('es-ES'),
    }));

    const headers = [
      { id: 'nombre', title: 'Nombre' },
      { id: 'apellidos', title: 'Apellidos' },
      { id: 'email', title: 'Email' },
      { id: 'telefono', title: 'Teléfono' },
      { id: 'totalPedidos', title: 'Total Pedidos' },
      { id: 'activo', title: 'Activo' },
      { id: 'fechaRegistro', title: 'Fecha Registro' },
    ];

    await ReportExportHelper.generateCSV(
      res,
      csvData,
      `reporte-clientes-${new Date().getTime()}.csv`,
      headers,
    );
  }

  /**
   * Exportar reporte de productos a PDF
   */
  async reporteProductosPDF(dto: ReporteProductosDto, res: Response) {
    const data = await this.reporteProductos(dto);
    const { resumen, productos } = data.response.data;

    await ReportExportHelper.generatePDF(
      res,
      'Reporte de Productos',
      resumen,
      productos,
      `reporte-productos-${new Date().getTime()}.pdf`,
    );
  }

  /**
   * Exportar reporte de productos a CSV
   */
  async reporteProductosCSV(dto: ReporteProductosDto, res: Response) {
    const data = await this.reporteProductos(dto);
    const { productos } = data.response.data;

    const csvData = productos.map((producto) => ({
      nombre: producto.nombre,
      sku: producto.codigoSKU,
      categoria: producto.categoria.nombre,
      tipo: producto.tipo.nombre,
      precio: producto.precio,
      stock: producto.stock,
      peso: producto.peso,
      unidad: producto.unidad,
      activo: producto.estaActivo ? 'Sí' : 'No',
      cantidadVendida: producto._count.itemsPedido,
    }));

    const headers = [
      { id: 'nombre', title: 'Nombre' },
      { id: 'sku', title: 'SKU' },
      { id: 'categoria', title: 'Categoría' },
      { id: 'tipo', title: 'Tipo' },
      { id: 'precio', title: 'Precio' },
      { id: 'stock', title: 'Stock' },
      { id: 'peso', title: 'Peso' },
      { id: 'unidad', title: 'Unidad' },
      { id: 'activo', title: 'Activo' },
      { id: 'cantidadVendida', title: 'Cantidad Vendida' },
    ];

    await ReportExportHelper.generateCSV(
      res,
      csvData,
      `reporte-productos-${new Date().getTime()}.csv`,
      headers,
    );
  }

  /**
   * Exportar reporte de pedidos a PDF
   */
  async reportePedidosPDF(dto: ReportePedidosDto, res: Response) {
    const data = await this.reportePedidos(dto);
    const { resumen, pedidos } = data.response.data;

    await ReportExportHelper.generatePDF(
      res,
      'Reporte de Pedidos',
      resumen,
      pedidos,
      `reporte-pedidos-${new Date().getTime()}.pdf`,
    );
  }

  /**
   * Exportar reporte de pedidos a CSV
   */
  async reportePedidosCSV(dto: ReportePedidosDto, res: Response) {
    const data = await this.reportePedidos(dto);
    const { pedidos } = data.response.data;

    const csvData = pedidos.map((pedido) => ({
      numeroPedido: pedido.numeroPedido,
      fecha: new Date(pedido.fechaCreacion).toLocaleDateString('es-ES'),
      cliente: pedido.usuario.nombre,
      sucursal: pedido.sucursal.nombre,
      estado: pedido.estado,
      estadoPago: pedido.estadoPago,
      metodoPago: pedido.metodoPago || 'N/A',
      subtotal: pedido.subtotal,
      total: pedido.montoTotal,
      cantidadItems: pedido.items.length,
    }));

    const headers = [
      { id: 'numeroPedido', title: 'N° Pedido' },
      { id: 'fecha', title: 'Fecha' },
      { id: 'cliente', title: 'Cliente' },
      { id: 'sucursal', title: 'Sucursal' },
      { id: 'estado', title: 'Estado' },
      { id: 'estadoPago', title: 'Estado Pago' },
      { id: 'metodoPago', title: 'Método Pago' },
      { id: 'subtotal', title: 'Subtotal' },
      { id: 'total', title: 'Total' },
      { id: 'cantidadItems', title: 'Cantidad Items' },
    ];

    await ReportExportHelper.generateCSV(
      res,
      csvData,
      `reporte-pedidos-${new Date().getTime()}.csv`,
      headers,
    );
  }

  /**
   * Exportar reporte de entregas a PDF
   */
  async reporteEntregasPDF(dto: ReporteEntregasDto, res: Response) {
    const data = await this.reporteEntregas(dto);
    const { resumen, entregas } = data.response.data;

    await ReportExportHelper.generatePDF(
      res,
      'Reporte de Entregas',
      resumen,
      entregas,
      `reporte-entregas-${new Date().getTime()}.pdf`,
    );
  }

  /**
   * Exportar reporte de entregas a CSV
   */
  async reporteEntregasCSV(dto: ReporteEntregasDto, res: Response) {
    const data = await this.reporteEntregas(dto);
    const { entregas } = data.response.data;

    const csvData = entregas.map((entrega) => ({
      pedidoId: entrega.pedido.numeroPedido,
      cliente: entrega.pedido.usuario.nombre,
      direccion: entrega.direccionEntrega,
      destinatario: entrega.nombreDestinatario,
      telefono: entrega.telefonoDestinatario,
      estado: entrega.estado,
      fechaEntrega: entrega.fechaEntrega
        ? new Date(entrega.fechaEntrega).toLocaleDateString('es-ES')
        : 'No programada',
      horario: entrega.horarioEntrega || 'N/A',
      sucursal: entrega.sucursal?.nombre || 'N/A',
      costoEntrega: entrega.costoEntrega,
    }));

    const headers = [
      { id: 'pedidoId', title: 'N° Pedido' },
      { id: 'cliente', title: 'Cliente' },
      { id: 'direccion', title: 'Dirección' },
      { id: 'destinatario', title: 'Destinatario' },
      { id: 'telefono', title: 'Teléfono' },
      { id: 'estado', title: 'Estado' },
      { id: 'fechaEntrega', title: 'Fecha Entrega' },
      { id: 'horario', title: 'Horario' },
      { id: 'sucursal', title: 'Sucursal' },
      { id: 'costoEntrega', title: 'Costo Entrega' },
    ];

    await ReportExportHelper.generateCSV(
      res,
      csvData,
      `reporte-entregas-${new Date().getTime()}.csv`,
      headers,
    );
  }
}
