import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ReporteService } from './reporte.service';
import {
  ReporteVentasDto,
  ReporteInventarioDto,
  ReporteClientesDto,
  ReporteProductosDto,
  ReportePedidosDto,
  ReporteEntregasDto,
} from './dto/reporte.input.dto';
import {
  ResponseReporteVentasType,
  ResponseReporteInventarioType,
  ResponseReporteClientesType,
  ResponseReporteProductosType,
  ResponseReportePedidosType,
  ResponseReporteEntregasType,
} from './dto/reporte.response';
import { BearerAuthPermision } from '../../../common/decorators/authorization.decorator';
import { PermisoEnum } from '../../../enums/permisos.enum';
import { ApiDescription } from '../../../common/decorators/controller.decorator';

@ApiTags('[admin] Reportes')
@Controller('admin/reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Post('ventas')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Generar reporte de ventas', [PermisoEnum.REPORTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseReporteVentasType })
  async reporteVentas(@Body() dto: ReporteVentasDto) {
    return this.reporteService.reporteVentas(dto);
  }

  @Post('ventas/pdf')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de ventas a PDF', [PermisoEnum.REPORTES_VER])
  async reporteVentasPDF(@Body() dto: ReporteVentasDto, @Res() res: Response) {
    return this.reporteService.reporteVentasPDF(dto, res);
  }

  @Post('ventas/csv')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de ventas a CSV', [PermisoEnum.REPORTES_VER])
  async reporteVentasCSV(@Body() dto: ReporteVentasDto, @Res() res: Response) {
    return this.reporteService.reporteVentasCSV(dto, res);
  }

  @Post('inventario')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Generar reporte de inventario', [PermisoEnum.REPORTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseReporteInventarioType })
  async reporteInventario(@Body() dto: ReporteInventarioDto) {
    return this.reporteService.reporteInventario(dto);
  }

  @Post('inventario/pdf')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de inventario a PDF', [PermisoEnum.REPORTES_VER])
  async reporteInventarioPDF(@Body() dto: ReporteInventarioDto, @Res() res: Response) {
    return this.reporteService.reporteInventarioPDF(dto, res);
  }

  @Post('inventario/csv')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de inventario a CSV', [PermisoEnum.REPORTES_VER])
  async reporteInventarioCSV(@Body() dto: ReporteInventarioDto, @Res() res: Response) {
    return this.reporteService.reporteInventarioCSV(dto, res);
  }

  @Post('clientes')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Generar reporte de clientes', [PermisoEnum.REPORTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseReporteClientesType })
  async reporteClientes(@Body() dto: ReporteClientesDto) {
    return this.reporteService.reporteClientes(dto);
  }

  @Post('clientes/pdf')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de clientes a PDF', [PermisoEnum.REPORTES_VER])
  async reporteClientesPDF(@Body() dto: ReporteClientesDto, @Res() res: Response) {
    return this.reporteService.reporteClientesPDF(dto, res);
  }

  @Post('clientes/csv')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de clientes a CSV', [PermisoEnum.REPORTES_VER])
  async reporteClientesCSV(@Body() dto: ReporteClientesDto, @Res() res: Response) {
    return this.reporteService.reporteClientesCSV(dto, res);
  }

  @Post('productos')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Generar reporte de productos', [PermisoEnum.REPORTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseReporteProductosType })
  async reporteProductos(@Body() dto: ReporteProductosDto) {
    return this.reporteService.reporteProductos(dto);
  }

  @Post('productos/pdf')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de productos a PDF', [PermisoEnum.REPORTES_VER])
  async reporteProductosPDF(@Body() dto: ReporteProductosDto, @Res() res: Response) {
    return this.reporteService.reporteProductosPDF(dto, res);
  }

  @Post('productos/csv')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de productos a CSV', [PermisoEnum.REPORTES_VER])
  async reporteProductosCSV(@Body() dto: ReporteProductosDto, @Res() res: Response) {
    return this.reporteService.reporteProductosCSV(dto, res);
  }

  @Post('pedidos')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Generar reporte de pedidos', [PermisoEnum.REPORTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseReportePedidosType })
  async reportePedidos(@Body() dto: ReportePedidosDto) {
    return this.reporteService.reportePedidos(dto);
  }

  @Post('pedidos/pdf')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de pedidos a PDF', [PermisoEnum.REPORTES_VER])
  async reportePedidosPDF(@Body() dto: ReportePedidosDto, @Res() res: Response) {
    return this.reporteService.reportePedidosPDF(dto, res);
  }

  @Post('pedidos/csv')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de pedidos a CSV', [PermisoEnum.REPORTES_VER])
  async reportePedidosCSV(@Body() dto: ReportePedidosDto, @Res() res: Response) {
    return this.reporteService.reportePedidosCSV(dto, res);
  }

  @Post('entregas')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Generar reporte de entregas', [PermisoEnum.REPORTES_VER])
  @ApiResponse({ status: 200, type: () => ResponseReporteEntregasType })
  async reporteEntregas(@Body() dto: ReporteEntregasDto) {
    return this.reporteService.reporteEntregas(dto);
  }

  @Post('entregas/pdf')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de entregas a PDF', [PermisoEnum.REPORTES_VER])
  async reporteEntregasPDF(@Body() dto: ReporteEntregasDto, @Res() res: Response) {
    return this.reporteService.reporteEntregasPDF(dto, res);
  }

  @Post('entregas/csv')
  @BearerAuthPermision([PermisoEnum.REPORTES_VER])
  @ApiDescription('Exportar reporte de entregas a CSV', [PermisoEnum.REPORTES_VER])
  async reporteEntregasCSV(@Body() dto: ReporteEntregasDto, @Res() res: Response) {
    return this.reporteService.reporteEntregasCSV(dto, res);
  }
}
