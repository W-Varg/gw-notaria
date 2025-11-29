import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  EstadisticasGeneralesResponse,
  VentasPorDiaResponse,
  VentasPorCategoriaResponse,
  TopProductosResponse,
  PedidosPendientesResponse,
  ClientesRecientesResponse,
  ProductosStockBajoResponse,
  ResumenEstadoPedidosResponse,
} from './dto/dashboard.response';
import {
  PeriodoQueryDto,
  TopProductosQueryDto,
  ClientesRecientesQueryDto,
} from './dto/dashboard.input.dto';

@ApiTags('[admin] Dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('estadisticas-generales')
  @ApiOperation({
    summary: 'Obtener estadísticas generales del dashboard',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: EstadisticasGeneralesResponse })
  async getEstadisticasGenerales(
    @Query() params: PeriodoQueryDto,
  ): Promise<EstadisticasGeneralesResponse> {
    return this.dashboardService.getEstadisticasGenerales(params);
  }

  @Get('ventas-por-dia')
  @ApiOperation({
    summary: 'Obtener ventas por día',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: VentasPorDiaResponse })
  async getVentasPorDia(@Query() params: PeriodoQueryDto): Promise<VentasPorDiaResponse> {
    return this.dashboardService.getVentasPorDia(params);
  }

  @Get('ventas-por-categoria')
  @ApiOperation({
    summary: 'Obtener ventas por categoría',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: VentasPorCategoriaResponse })
  async getVentasPorCategoria(
    @Query() params: PeriodoQueryDto,
  ): Promise<VentasPorCategoriaResponse> {
    return this.dashboardService.getVentasPorCategoria(params);
  }

  @Get('top-productos')
  @ApiOperation({
    summary: 'Obtener top productos más vendidos',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: TopProductosResponse })
  async getTopProductos(@Query() params: TopProductosQueryDto): Promise<TopProductosResponse> {
    return this.dashboardService.getTopProductos(params);
  }

  @Get('pedidos-pendientes')
  @ApiOperation({
    summary: 'Obtener pedidos pendientes de atención',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: PedidosPendientesResponse })
  async getPedidosPendientes(): Promise<PedidosPendientesResponse> {
    return this.dashboardService.getPedidosPendientes();
  }

  @Get('clientes-recientes')
  @ApiOperation({
    summary: 'Obtener clientes registrados recientemente',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: ClientesRecientesResponse })
  async getClientesRecientes(
    @Query() params: ClientesRecientesQueryDto,
  ): Promise<ClientesRecientesResponse> {
    return this.dashboardService.getClientesRecientes(params);
  }

  @Get('productos-stock-bajo')
  @ApiOperation({
    summary: 'Obtener productos con stock bajo',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: ProductosStockBajoResponse })
  async getProductosStockBajo(): Promise<ProductosStockBajoResponse> {
    return this.dashboardService.getProductosStockBajo();
  }

  @Get('resumen-estado-pedidos')
  @ApiOperation({
    summary: 'Obtener resumen de estado de pedidos',
    description: 'permisos requeridos: <ul> <li><b>DASHBOARD_VER</b></li> </ul>',
  })
  @ApiResponse({ status: 200, type: ResumenEstadoPedidosResponse })
  async getResumenEstadoPedidos(
    @Query() params: PeriodoQueryDto,
  ): Promise<ResumenEstadoPedidosResponse> {
    return this.dashboardService.getResumenEstadoPedidos(params);
  }
}
