import { Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { AlertasService } from './alertas.service';
import {
  ResponseStockAlertsType,
  ResponseRestockAlertsType,
  ResponseStockStatisticsType,
  ResponseStockCheckType,
} from './dto/alertas.response';

@ApiTags('[admin] Alertas de Stock')
@Controller('admin/alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get('stock-bajo')
  @BearerAuthPermision()
  @ApiDescription('Obtener productos con stock bajo')
  @ApiResponse({ status: 200, type: () => ResponseStockAlertsType })
  async getLowStock() {
    return this.alertasService.getLowStockAlerts();
  }

  @Get('stock-critico')
  @BearerAuthPermision()
  @ApiDescription('Obtener productos con stock crítico')
  @ApiResponse({ status: 200, type: () => ResponseStockAlertsType })
  async getCriticalStock() {
    return this.alertasService.getCriticalStockAlerts();
  }

  @Get('estadisticas')
  @BearerAuthPermision()
  @ApiDescription('Obtener estadísticas de stock')
  @ApiResponse({ status: 200, type: () => ResponseStockStatisticsType })
  async getStockStatistics() {
    return this.alertasService.getStockStatistics();
  }

  @Get('reabastecimiento')
  @BearerAuthPermision()
  @ApiDescription('Obtener productos que necesitan reabastecimiento')
  @ApiResponse({ status: 200, type: () => ResponseRestockAlertsType })
  async getProductsNeedingRestock() {
    return this.alertasService.getRestockAlerts();
  }

  @Post('verificar-stock')
  @BearerAuthPermision()
  @ApiDescription('Verificar stock manualmente y enviar alertas')
  @ApiResponse({ status: 200, type: () => ResponseStockCheckType })
  async checkStockManually() {
    return this.alertasService.checkStockManually();
  }
}
