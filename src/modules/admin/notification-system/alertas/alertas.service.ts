import { Injectable } from '@nestjs/common';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { StockAlert, StockAlertService } from '../services/stock-alert.service';

@Injectable()
export class AlertasService {
  constructor(private readonly stockAlertService: StockAlertService) {}

  async getLowStockAlerts() {
    try {
      const alerts = await this.stockAlertService.getLowStockItems();
      return dataResponseSuccess<StockAlert[]>({ data: alerts });
    } catch (_error) {
      return dataResponseError('Error al obtener alertas de stock bajo');
    }
  }

  async getCriticalStockAlerts() {
    try {
      const alerts = await this.stockAlertService.getCriticalStockItems();
      return dataResponseSuccess<StockAlert[]>({ data: alerts });
    } catch (_error) {
      return dataResponseError('Error al obtener alertas de stock crítico');
    }
  }

  async getStockStatistics() {
    try {
      const stats = await this.stockAlertService.getStockStatistics();
      return dataResponseSuccess({ data: stats });
    } catch (_error) {
      return dataResponseError('Error al obtener estadísticas de stock');
    }
  }

  async getRestockAlerts() {
    try {
      const products = await this.stockAlertService.getProductsNeedingRestock();
      return dataResponseSuccess({ data: products });
    } catch (_error) {
      return dataResponseError('Error al obtener productos para reabastecimiento');
    }
  }

  async checkStockManually() {
    try {
      await this.stockAlertService.checkLowStock();
      return dataResponseSuccess({
        data: {
          message: 'Verificación de stock completada exitosamente',
          checkedAt: new Date(),
        },
      });
    } catch (_error) {
      return dataResponseError('Error al verificar stock manualmente');
    }
  }
}
