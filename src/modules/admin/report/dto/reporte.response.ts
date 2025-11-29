import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Reporte, ReporteDetail } from '../reporte.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class ReporteData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Reporte })
  data: Reporte;
}

export class ResponseReporteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteData })
  declare response: ReporteData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ReporteDetailData {
  @ApiProperty({ type: ReporteDetail })
  data: ReporteDetail;
}

export class ResponseReporteDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteDetailData })
  declare response: ReporteDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ReportesData {
  @ApiProperty({ type: [Reporte] })
  data?: Reporte[];
}

export class ResponseReportesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReportesData })
  declare response: ReportesData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateReportesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Reporte] })
  data?: Reporte[];
}

export class PaginateReportesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateReportesData })
  declare response: PaginateReportesData;
}

/* ================================================================================================================== */
// REPORTE DE VENTAS
/* ================================================================================================================== */

class PeriodoReporte {
  @ApiProperty({
    description: 'Fecha de inicio del periodo',
    example: '2024-01-01',
    required: false,
  })
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin del periodo', example: '2024-12-31', required: false })
  fechaFin?: string;
}

class PedidoVenta {
  @ApiProperty({ description: 'ID del pedido', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Número del pedido', example: 'PED-001' })
  numeroPedido: string;

  @ApiProperty({ description: 'Fecha del pedido', example: '2024-01-15T10:30:00.000Z' })
  fechaCreacion: Date;

  @ApiProperty({ description: 'Total del pedido', example: 150.5 })
  total: number;

  @ApiProperty({ description: 'Estado del pedido', example: 'CONFIRMADO' })
  estado: string;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  cliente: string;
}

class ResumenVentas {
  @ApiProperty({ description: 'Total de ventas en el periodo', example: 15000 })
  totalVentas: number;

  @ApiProperty({ description: 'Número total de pedidos', example: 150 })
  totalPedidos: number;

  @ApiProperty({ description: 'Promedio por pedido', example: 100 })
  promedioPorPedido: number;

  @ApiProperty({ type: PeriodoReporte, description: 'Periodo del reporte' })
  periodo: PeriodoReporte;
}

class ReporteVentasData {
  @ApiProperty({ type: ResumenVentas, description: 'Resumen del reporte de ventas' })
  resumen: ResumenVentas;

  @ApiProperty({ type: [PedidoVenta], description: 'Lista de pedidos' })
  pedidos: PedidoVenta[];
}

class ReporteVentasDataWrapper {
  @ApiProperty({ type: ReporteVentasData, description: 'Datos del reporte de ventas' })
  data: ReporteVentasData;
}

export class ResponseReporteVentasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteVentasDataWrapper })
  declare response: ReporteVentasDataWrapper;
}

/* ================================================================================================================== */
// REPORTE DE INVENTARIO
/* ================================================================================================================== */

class InventarioItem {
  @ApiProperty({ description: 'ID del producto', example: '123e4567-e89b-12d3-a456-426614174000' })
  productoId: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Alimento para perros Premium' })
  nombreProducto: string;

  @ApiProperty({ description: 'Stock actual', example: 50 })
  stock: number;

  @ApiProperty({ description: 'Stock mínimo', example: 10 })
  stockMinimo: number;

  @ApiProperty({ description: 'Precio unitario', example: 25.5 })
  precio: number;

  @ApiProperty({ description: 'Valor total en inventario', example: 1275 })
  valorTotal: number;
}

class ProductoBajoStock {
  @ApiProperty({ description: 'ID del producto', example: '123e4567-e89b-12d3-a456-426614174000' })
  productoId: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Shampoo para mascotas' })
  nombreProducto: string;

  @ApiProperty({ description: 'Stock actual', example: 5 })
  stockActual: number;

  @ApiProperty({ description: 'Stock mínimo requerido', example: 20 })
  stockMinimo: number;

  @ApiProperty({ description: 'Diferencia de stock', example: -15 })
  diferencia: number;
}

class ResumenInventario {
  @ApiProperty({ description: 'Número total de productos', example: 500 })
  totalProductos: number;

  @ApiProperty({ description: 'Número de productos con bajo stock', example: 25 })
  productosBajoStock: number;

  @ApiProperty({ description: 'Valor total del inventario', example: 75000 })
  valorTotalInventario: number;
}

class ReporteInventarioData {
  @ApiProperty({ type: ResumenInventario, description: 'Resumen del inventario' })
  resumen: ResumenInventario;

  @ApiProperty({ type: [InventarioItem], description: 'Lista de inventarios' })
  inventarios: InventarioItem[];

  @ApiProperty({ type: [ProductoBajoStock], description: 'Lista de productos con bajo stock' })
  productosBajoStock: ProductoBajoStock[];
}

class ReporteInventarioDataWrapper {
  @ApiProperty({ type: ReporteInventarioData, description: 'Datos del reporte de inventario' })
  data: ReporteInventarioData;
}

export class ResponseReporteInventarioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteInventarioDataWrapper })
  declare response: ReporteInventarioDataWrapper;
}

/* ================================================================================================================== */
// REPORTE DE CLIENTES
/* ================================================================================================================== */

class ClienteReporte {
  @ApiProperty({ description: 'ID del cliente', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nombre completo del cliente', example: 'Juan Pérez' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Email del cliente', example: 'juan.perez@email.com' })
  email: string;

  @ApiProperty({ description: 'Teléfono del cliente', example: '+591 70123456' })
  telefono: string;

  @ApiProperty({ description: 'Número total de pedidos', example: 15 })
  totalPedidos: number;

  @ApiProperty({ description: 'Total gastado por el cliente', example: 2500.75 })
  totalGastado: number;

  @ApiProperty({ description: 'Fecha de última compra', example: '2024-01-15T10:30:00Z' })
  ultimaCompra: Date;
}

class ResumenClientes {
  @ApiProperty({ description: 'Número total de usuarios/clientes', example: 1500 })
  totalUsuarios: number;

  @ApiProperty({ description: 'Número de clientes activos', example: 800 })
  clientesActivos: number;

  @ApiProperty({ description: 'Número total de pedidos', example: 2500 })
  totalPedidos: number;
}

class ReporteClientesData {
  @ApiProperty({ type: ResumenClientes, description: 'Resumen de clientes' })
  resumen: ResumenClientes;

  @ApiProperty({ type: [ClienteReporte], description: 'Lista de clientes' })
  clientes: ClienteReporte[];
}

class ReporteClientesDataWrapper {
  @ApiProperty({ type: ReporteClientesData, description: 'Datos del reporte de clientes' })
  data: ReporteClientesData;
}

export class ResponseReporteClientesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteClientesDataWrapper })
  declare response: ReporteClientesDataWrapper;
}

/* ================================================================================================================== */
// REPORTE DE PRODUCTOS
/* ================================================================================================================== */

class ProductoReporte {
  @ApiProperty({ description: 'ID del producto', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Alimento para perros Premium' })
  nombre: string;

  @ApiProperty({ description: 'Categoría del producto', example: 'Alimentos' })
  categoria: string;

  @ApiProperty({ description: 'Precio del producto', example: 45.5 })
  precio: number;

  @ApiProperty({ description: 'Stock disponible', example: 100 })
  stock: number;

  @ApiProperty({ description: 'Total de ventas', example: 250 })
  ventas: number;

  @ApiProperty({ description: 'Estado del producto', example: 'ACTIVO' })
  estado: string;
}

class ProductoMasVendido {
  @ApiProperty({ description: 'ID del producto', example: '123e4567-e89b-12d3-a456-426614174000' })
  productoId: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Alimento para gatos' })
  nombreProducto: string;

  @ApiProperty({ description: 'Cantidad vendida', example: 500 })
  cantidadVendida: number;

  @ApiProperty({ description: 'Ingreso total generado', example: 22750.5 })
  ingresoTotal: number;

  @ApiProperty({ description: 'Posición en el ranking', example: 1 })
  ranking: number;
}

class ResumenProductos {
  @ApiProperty({ description: 'Número total de productos', example: 250 })
  totalProductos: number;

  @ApiProperty({ description: 'Número de productos activos', example: 200 })
  productosActivos: number;

  @ApiProperty({ description: 'Número de productos con bajo stock', example: 25 })
  productosBajoStock: number;
}

class ReporteProductosData {
  @ApiProperty({ type: ResumenProductos, description: 'Resumen de productos' })
  resumen: ResumenProductos;

  @ApiProperty({ type: [ProductoReporte], description: 'Lista de productos' })
  productos: ProductoReporte[];

  @ApiProperty({ type: [ProductoMasVendido], description: 'Lista de productos más vendidos' })
  productosMasVendidos: ProductoMasVendido[];
}

class ReporteProductosDataWrapper {
  @ApiProperty({ type: ReporteProductosData, description: 'Datos del reporte de productos' })
  data: ReporteProductosData;
}

export class ResponseReporteProductosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteProductosDataWrapper })
  declare response: ReporteProductosDataWrapper;
}

/* ================================================================================================================== */
// REPORTE DE PEDIDOS
/* ================================================================================================================== */

class ResumenPedidos {
  @ApiProperty({ description: 'Número total de pedidos', example: 5000 })
  totalPedidos: number;

  @ApiProperty({ description: 'Número de pedidos completados', example: 4200 })
  pedidosCompletados: number;

  @ApiProperty({ description: 'Número de pedidos pendientes', example: 600 })
  pedidosPendientes: number;

  @ApiProperty({ description: 'Número de pedidos cancelados', example: 200 })
  pedidosCancelados: number;

  @ApiProperty({ description: 'Ticket promedio', example: 125.5 })
  ticketPromedio: number;
}

class ReportePedidosData {
  @ApiProperty({ type: ResumenPedidos, description: 'Resumen de pedidos' })
  resumen: ResumenPedidos;

  @ApiProperty({ type: [PedidoVenta], description: 'Lista de pedidos' })
  pedidos: PedidoVenta[];
}

class ReportePedidosDataWrapper {
  @ApiProperty({ type: ReportePedidosData, description: 'Datos del reporte de pedidos' })
  data: ReportePedidosData;
}

export class ResponseReportePedidosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReportePedidosDataWrapper })
  declare response: ReportePedidosDataWrapper;
}

/* ================================================================================================================== */
// REPORTE DE ENTREGAS
/* ================================================================================================================== */

class EntregaReporte {
  @ApiProperty({ description: 'ID de la entrega', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    description: 'ID del pedido relacionado',
    example: '456e7890-e89b-12d3-a456-426614174111',
  })
  pedidoId: string;

  @ApiProperty({ description: 'Número del pedido', example: 'PED-001' })
  numeroPedido: string;

  @ApiProperty({ description: 'Dirección de entrega', example: 'Av. Siempre Viva 742' })
  direccion: string;

  @ApiProperty({ description: 'Estado de la entrega', example: 'ENTREGADO' })
  estado: string;

  @ApiProperty({ description: 'Fecha estimada de entrega', example: '2024-01-15T10:00:00Z' })
  fechaEstimada: Date;

  @ApiProperty({
    description: 'Fecha real de entrega',
    example: '2024-01-15T09:45:00Z',
    required: false,
  })
  fechaEntrega?: Date;

  @ApiProperty({ description: 'Nombre del repartidor', example: 'Carlos Rodríguez' })
  repartidor: string;
}

class ResumenEntregas {
  @ApiProperty({ description: 'Número total de entregas', example: 4500 })
  totalEntregas: number;

  @ApiProperty({ description: 'Número de entregas completadas', example: 4000 })
  entregasCompletadas: number;

  @ApiProperty({ description: 'Número de entregas pendientes', example: 400 })
  entregasPendientes: number;

  @ApiProperty({ description: 'Número de entregas fallidas', example: 100 })
  entregasFallidas: number;

  @ApiProperty({ description: 'Porcentaje de entregas a tiempo', example: 92.5 })
  tasaEntregasATiempo: number;
}

class ReporteEntregasData {
  @ApiProperty({ type: ResumenEntregas, description: 'Resumen de entregas' })
  resumen: ResumenEntregas;

  @ApiProperty({ type: [EntregaReporte], description: 'Lista de entregas' })
  entregas: EntregaReporte[];
}

class ReporteEntregasDataWrapper {
  @ApiProperty({ type: ReporteEntregasData, description: 'Datos del reporte de entregas' })
  data: ReporteEntregasData;
}

export class ResponseReporteEntregasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReporteEntregasDataWrapper })
  declare response: ReporteEntregasDataWrapper;
}
