import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationService } from './notification.service';

export interface StockAlert {
  id: string;
  productoId: string;
  sucursalId: string;
  productoNombre: string;
  sucursalNombre: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  diferencia: number;
  porcentajeStock: number;
}

@Injectable()
export class StockAlertService {
  private readonly logger = new Logger(StockAlertService.name);
  private readonly alertThreshold = 0.2; // 20% del stock mínimo

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Verifica el stock bajo cada 30 minutos
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkLowStock(): Promise<void> {
    this.logger.log('Iniciando verificación de stock bajo...');

    try {
      const lowStockItems = await this.getLowStockItems();

      if (lowStockItems.length > 0) {
        this.logger.warn(`Se encontraron ${lowStockItems.length} productos con stock bajo`);

        // Enviar notificaciones
        await this.sendStockAlerts(lowStockItems);

        // Registrar en logs
        this.logger.warn('Alertas de stock bajo enviadas:', lowStockItems);
      } else {
        this.logger.log('No se encontraron productos con stock bajo');
      }
    } catch (error) {
      this.logger.error('Error al verificar stock bajo:', error);
    }
  }

  /**
   * Obtiene productos con stock bajo
   */
  async getLowStockItems(): Promise<StockAlert[]> {
    // Usar consulta SQL raw para comparar stock con stockMinimo
    const inventarios: any[] = await this.prisma.$queryRaw`
      SELECT 
        i.id,
        i."productoId",
        i."sucursalId",
        i.stock,
        i."stockMinimo",
        i."stockMaximo",
        p.nombre as "productoNombre",
        s.nombre as "sucursalNombre",
        s.ciudad
      FROM "prod_inventarios" i
      JOIN "prod_productos" p ON i."productoId" = p.id
      JOIN "loc_sucursales" s ON i."sucursalId" = s.id
      WHERE i.stock <= i."stockMinimo"
    `;

    return inventarios.map((inv) => {
      const porcentajeStock = (inv.stock / inv.stockMinimo) * 100;
      const diferencia = inv.stockMinimo - inv.stock;

      return {
        id: inv.id,
        productoId: inv.productoId,
        sucursalId: inv.sucursalId,
        productoNombre: inv.producto.nombre,
        sucursalNombre: inv.sucursal.nombre,
        stockActual: inv.stock,
        stockMinimo: inv.stockMinimo,
        stockMaximo: inv.stockMaximo,
        diferencia,
        porcentajeStock: Math.round(porcentajeStock * 100) / 100,
      };
    });
  }

  /**
   * Obtiene productos con stock crítico (menos del 20% del mínimo)
   */
  async getCriticalStockItems(): Promise<StockAlert[]> {
    // Usar consulta SQL raw para comparar stock con 20% del stockMinimo
    const inventarios: any[] = await this.prisma.$queryRaw`
      SELECT 
        i.id,
        i."productoId",
        i."sucursalId",
        i.stock,
        i."stockMinimo",
        i."stockMaximo",
        p.nombre as "productoNombre",
        s.nombre as "sucursalNombre",
        s.ciudad
      FROM "prod_inventarios" i
      JOIN "prod_productos" p ON i."productoId" = p.id
      JOIN "loc_sucursales" s ON i."sucursalId" = s.id
      WHERE i.stock <= (i."stockMinimo" * ${this.alertThreshold})
    `;

    return inventarios.map((inv) => {
      const porcentajeStock = (inv.stock / inv.stockMinimo) * 100;
      const diferencia = inv.stockMinimo - inv.stock;

      return {
        id: inv.id,
        productoId: inv.productoId,
        sucursalId: inv.sucursalId,
        productoNombre: inv.producto.nombre,
        sucursalNombre: inv.sucursal.nombre,
        stockActual: inv.stock,
        stockMinimo: inv.stockMinimo,
        stockMaximo: inv.stockMaximo,
        diferencia,
        porcentajeStock: Math.round(porcentajeStock * 100) / 100,
      };
    });
  }

  /**
   * Envía alertas de stock bajo
   */
  private async sendStockAlerts(alerts: StockAlert[]): Promise<void> {
    // Agrupar por sucursal
    const alertsBySucursal = alerts.reduce(
      (acc, alert) => {
        if (!acc[alert.sucursalId]) {
          acc[alert.sucursalId] = {
            sucursalNombre: alert.sucursalNombre,
            alerts: [],
          };
        }
        acc[alert.sucursalId].alerts.push(alert);
        return acc;
      },
      {} as Record<string, { sucursalNombre: string; alerts: StockAlert[] }>,
    );

    // Enviar notificación por sucursal
    for (const [sucursalId, data] of Object.entries(alertsBySucursal)) {
      await this.notificationService.notifyStockAlert(sucursalId, data.sucursalNombre, data.alerts);
    }
  }

  /**
   * Obtiene estadísticas de stock
   */
  async getStockStatistics() {
    const [totalInventarios, lowStockResult, criticalStockResult, outOfStockCount] =
      await Promise.all([
        this.prisma.inventario.count(),
        this.prisma
          .$queryRaw`SELECT COUNT(*) as count FROM "prod_inventarios" WHERE stock <= "stockMinimo" AND stock > 0`,
        this.prisma
          .$queryRaw`SELECT COUNT(*) as count FROM "prod_inventarios" WHERE stock <= ("stockMinimo" * ${this.alertThreshold}) AND stock > 0`,
        this.prisma.inventario.count({
          where: {
            stock: 0,
          },
        }),
      ]);

    const lowStockCount = (lowStockResult as any[])[0]?.count || 0;
    const criticalStockCount = (criticalStockResult as any[])[0]?.count || 0;

    return {
      totalInventarios,
      lowStockCount,
      criticalStockCount,
      outOfStockCount,
      healthyStockCount: totalInventarios - lowStockCount - outOfStockCount,
    };
  }

  /**
   * Obtiene productos que necesitan reabastecimiento
   */
  async getProductsNeedingRestock(): Promise<StockAlert[]> {
    // Usar consulta SQL raw para obtener productos que necesitan reabastecimiento
    const inventarios: any[] = await this.prisma.$queryRaw`
      SELECT 
        i.id,
        i."productoId",
        i."sucursalId",
        i.stock,
        i."stockMinimo",
        i."stockMaximo",
        p.nombre as "productoNombre",
        p.precio,
        s.nombre as "sucursalNombre",
        s.ciudad
      FROM "prod_inventarios" i
      JOIN "prod_productos" p ON i."productoId" = p.id
      JOIN "loc_sucursales" s ON i."sucursalId" = s.id
      WHERE i.stock <= i."stockMinimo"
      ORDER BY i.stock ASC
    `;

    return inventarios.map((inv) => {
      const porcentajeStock = (inv.stock / inv.stockMinimo) * 100;
      const diferencia = inv.stockMinimo - inv.stock;
      const cantidadRecomendada = Math.max(diferencia, inv.stockMaximo - inv.stock);

      return {
        id: inv.id,
        productoId: inv.productoId,
        sucursalId: inv.sucursalId,
        productoNombre: inv.producto.nombre,
        sucursalNombre: inv.sucursal.nombre,
        stockActual: inv.stock,
        stockMinimo: inv.stockMinimo,
        stockMaximo: inv.stockMaximo,
        diferencia,
        porcentajeStock: Math.round(porcentajeStock * 100) / 100,
        cantidadRecomendada,
        valorRecomendado: cantidadRecomendada * inv.producto.precio,
      } as StockAlert & { cantidadRecomendada: number; valorRecomendado: number };
    });
  }
}
