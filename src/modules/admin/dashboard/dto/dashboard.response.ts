import { ApiProperty } from '@nestjs/swagger';

// ==================== ESTADÍSTICAS GENERALES ====================
export class EstadisticasGeneralesResponse {
  @ApiProperty({ description: 'Total de ventas del período' })
  totalVentas: number;

  @ApiProperty({ description: 'Monto total vendido' })
  montoTotalVendido: number;

  @ApiProperty({ description: 'Total de pedidos' })
  totalPedidos: number;

  @ApiProperty({ description: 'Total de clientes registrados' })
  totalClientes: number;

  @ApiProperty({ description: 'Promedio de venta por pedido' })
  promedioVentaPorPedido: number;

  @ApiProperty({ description: 'Tasa de crecimiento vs período anterior (%)' })
  tasaCrecimiento: number;
}

// ==================== VENTAS POR DÍA ====================
export class VentaPorDiaItem {
  @ApiProperty({ description: 'Fecha del día' })
  fecha: string;

  @ApiProperty({ description: 'Monto total vendido en el día' })
  monto: number;

  @ApiProperty({ description: 'Cantidad de pedidos en el día' })
  cantidadPedidos: number;
}

export class VentasPorDiaResponse {
  @ApiProperty({ description: 'Ventas diarias', type: [VentaPorDiaItem] })
  ventas: VentaPorDiaItem[];
}

// ==================== VENTAS POR CATEGORÍA ====================
export class VentaPorCategoriaItem {
  @ApiProperty({ description: 'ID de la categoría' })
  categoriaId: string;

  @ApiProperty({ description: 'Nombre de la categoría' })
  categoria: string;

  @ApiProperty({ description: 'Monto total vendido' })
  monto: number;

  @ApiProperty({ description: 'Cantidad de productos vendidos' })
  cantidad: number;

  @ApiProperty({ description: 'Porcentaje del total' })
  porcentaje: number;
}

export class VentasPorCategoriaResponse {
  @ApiProperty({ description: 'Ventas por categoría', type: [VentaPorCategoriaItem] })
  ventas: VentaPorCategoriaItem[];
}

// ==================== TOP PRODUCTOS ====================
export class ProductoTopItem {
  @ApiProperty({ description: 'ID del producto' })
  productoId: string;

  @ApiProperty({ description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ description: 'Cantidad vendida' })
  cantidadVendida: number;

  @ApiProperty({ description: 'Monto total generado' })
  montoTotal: number;

  @ApiProperty({ description: 'Imagen del producto' })
  imagen?: string;

  @ApiProperty({ description: 'Categoría del producto' })
  categoria: string;
}

export class TopProductosResponse {
  @ApiProperty({ description: 'Top productos más vendidos', type: [ProductoTopItem] })
  productos: ProductoTopItem[];
}

// ==================== PEDIDOS PENDIENTES ====================
export class PedidoPendienteItem {
  @ApiProperty({ description: 'ID del pedido' })
  id: string;

  @ApiProperty({ description: 'Número de pedido' })
  numeroPedido: string;

  @ApiProperty({ description: 'Cliente' })
  cliente: string;

  @ApiProperty({ description: 'Estado del pedido' })
  estado: string;

  @ApiProperty({ description: 'Monto total' })
  total: number;

  @ApiProperty({ description: 'Fecha de creación' })
  fechaCreacion: Date;

  @ApiProperty({ description: 'Cantidad de items' })
  cantidadItems: number;
}

export class PedidosPendientesResponse {
  @ApiProperty({ description: 'Pedidos pendientes de atención', type: [PedidoPendienteItem] })
  pedidos: PedidoPendienteItem[];

  @ApiProperty({ description: 'Total de pedidos pendientes' })
  total: number;
}

// ==================== CLIENTES RECIENTES ====================
export class ClienteRecienteItem {
  @ApiProperty({ description: 'ID del cliente' })
  id: string;

  @ApiProperty({ description: 'Nombre completo' })
  nombre: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Avatar' })
  avatar?: string;

  @ApiProperty({ description: 'Fecha de registro' })
  fechaRegistro: Date;

  @ApiProperty({ description: 'Total de pedidos realizados' })
  totalPedidos: number;

  @ApiProperty({ description: 'Monto total gastado' })
  montoTotalGastado: number;
}

export class ClientesRecientesResponse {
  @ApiProperty({ description: 'Clientes registrados recientemente', type: [ClienteRecienteItem] })
  clientes: ClienteRecienteItem[];
}

// ==================== PRODUCTOS CON STOCK BAJO ====================
export class ProductoStockBajoItem {
  @ApiProperty({ description: 'ID del producto' })
  productoId: string;

  @ApiProperty({ description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ description: 'SKU' })
  sku: string;

  @ApiProperty({ description: 'Stock actual' })
  stockActual: number;

  @ApiProperty({ description: 'Stock mínimo' })
  stockMinimo: number;

  @ApiProperty({ description: 'Sucursal' })
  sucursal: string;

  @ApiProperty({ description: 'Categoría' })
  categoria: string;
}

export class ProductosStockBajoResponse {
  @ApiProperty({ description: 'Productos con stock bajo', type: [ProductoStockBajoItem] })
  productos: ProductoStockBajoItem[];

  @ApiProperty({ description: 'Total de productos con stock bajo' })
  total: number;
}

// ==================== RESUMEN DE ESTADO DE PEDIDOS ====================
export class EstadoPedidosItem {
  @ApiProperty({ description: 'Estado del pedido' })
  estado: string;

  @ApiProperty({ description: 'Cantidad de pedidos' })
  cantidad: number;

  @ApiProperty({ description: 'Monto total' })
  monto: number;
}

export class ResumenEstadoPedidosResponse {
  @ApiProperty({ description: 'Resumen por estado', type: [EstadoPedidosItem] })
  estados: EstadoPedidosItem[];
}
