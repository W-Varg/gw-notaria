import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';
import { WebhookService } from './webhook.service';
import { StockAlertService } from './stock-alert.service';

export interface SystemMetrics {
  timestamp: Date;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalReservations: number;
  lowStockProducts: number;
  criticalStockProducts: number;
  outOfStockProducts: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private metrics: SystemMetrics | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly webhookService: WebhookService,
    private readonly stockAlertService: StockAlertService,
  ) {}

  /**
   * Recopila métricas del sistema cada 5 minutos
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async collectMetrics(): Promise<void> {
    this.logger.log('Recopilando métricas del sistema...');

    try {
      const metrics = await this.gatherSystemMetrics();
      this.metrics = metrics;

      // Enviar webhook con métricas
      await this.webhookService.sendWebhook({
        type: 'system.metrics',
        data: metrics,
        timestamp: new Date(),
        source: 'petshop-backend',
      });

      this.logger.log('Métricas recopiladas exitosamente');
    } catch (error) {
      this.logger.error('Error al recopilar métricas:', error);
    }
  }

  /**
   * Verifica la salud del sistema cada minuto
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async healthCheck(): Promise<void> {
    try {
      const health = await this.checkSystemHealth();

      if (!health.isHealthy) {
        this.logger.warn('Sistema no saludable detectado:', health.issues);

        // Enviar alerta de salud
        await this.webhookService.sendWebhook({
          type: 'system.unhealthy',
          data: health,
          timestamp: new Date(),
          source: 'petshop-backend',
        });
      }
    } catch (error) {
      this.logger.error('Error en health check:', error);
    }
  }

  private async gatherSystemMetrics(): Promise<SystemMetrics> {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalReservations,
      stockStats,
      orderStats,
      revenueStats,
    ] = await Promise.all([
      this.prisma.producto.count(),
      this.prisma.usuario.count(),
      this.prisma.pedido.count(),
      this.prisma.reserva.count(),
      this.getStockStatistics(),
      this.getOrderStatistics(),
      this.getRevenueStatistics(),
    ]);

    return {
      timestamp: new Date(),
      totalProducts,
      totalUsers,
      totalOrders,
      totalReservations,
      lowStockProducts: stockStats.lowStockCount,
      criticalStockProducts: stockStats.criticalStockCount,
      outOfStockProducts: stockStats.outOfStockCount,
      activeOrders: orderStats.activeOrders,
      pendingOrders: orderStats.pendingOrders,
      completedOrders: orderStats.completedOrders,
      cancelledOrders: orderStats.cancelledOrders,
      totalRevenue: revenueStats.totalRevenue,
      averageOrderValue: revenueStats.averageOrderValue,
    };
  }

  private async getStockStatistics() {
    const [lowStockResult, criticalStockResult, outOfStockCount] = await Promise.all([
      this.prisma
        .$queryRaw`SELECT COUNT(*) as count FROM "prod_inventarios" WHERE stock <= "stockMinimo" AND stock > 0`,
      this.prisma
        .$queryRaw`SELECT COUNT(*) as count FROM "prod_inventarios" WHERE stock <= ("stockMinimo" * 0.2) AND stock > 0`,
      this.prisma.inventario.count({
        where: { stock: 0 },
      }),
    ]);

    const lowStockCount = (lowStockResult as any[])[0]?.count || 0;
    const criticalStockCount = (criticalStockResult as any[])[0]?.count || 0;

    return {
      lowStockCount,
      criticalStockCount,
      outOfStockCount,
    };
  }

  private async getOrderStatistics() {
    const [activeOrders, pendingOrders, completedOrders, cancelledOrders] = await Promise.all([
      this.prisma.pedido.count({
        where: {
          estado: {
            in: ['CONFIRMADO', 'EN_PREPARACION', 'LISTO_PARA_ENTREGA'],
          },
        },
      }),
      this.prisma.pedido.count({
        where: { estado: 'PENDIENTE' },
      }),
      this.prisma.pedido.count({
        where: { estado: 'ENTREGADO' },
      }),
      this.prisma.pedido.count({
        where: { estado: 'CANCELADO' },
      }),
    ]);

    return { activeOrders, pendingOrders, completedOrders, cancelledOrders };
  }

  private async getRevenueStatistics() {
    const result = await this.prisma.pedido.aggregate({
      where: {
        estado: 'ENTREGADO',
        fechaCreacion: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Este mes
        },
      },
      _sum: { montoTotal: true },
      _count: { id: true },
    });

    const totalRevenue = result._sum.montoTotal || 0;
    const orderCount = result._count.id || 0;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    return { totalRevenue, averageOrderValue };
  }

  private async checkSystemHealth(): Promise<{ isHealthy: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      // Verificar conexión a la base de datos
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      issues.push('Database connection failed');
    }

    try {
      // Verificar stock crítico
      const criticalStock = await this.stockAlertService.getCriticalStockItems();
      if (criticalStock.length > 10) {
        issues.push(`High number of critical stock items: ${criticalStock.length}`);
      }
    } catch (error) {
      issues.push('Stock check failed');
    }

    try {
      // Verificar pedidos pendientes por mucho tiempo
      const oldPendingOrders = await this.prisma.pedido.count({
        where: {
          estado: 'PENDIENTE',
          fechaCreacion: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Más de 24 horas
          },
        },
      });

      if (oldPendingOrders > 5) {
        issues.push(`High number of old pending orders: ${oldPendingOrders}`);
      }
    } catch (error) {
      issues.push('Order check failed');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
    };
  }

  /**
   * Obtiene las métricas actuales del sistema
   */
  getCurrentMetrics(): SystemMetrics | null {
    return this.metrics;
  }

  /**
   * Obtiene un resumen de salud del sistema
   */
  async getSystemHealth(): Promise<{
    isHealthy: boolean;
    issues: string[];
    metrics: SystemMetrics | null;
  }> {
    const health = await this.checkSystemHealth();
    return {
      ...health,
      metrics: this.metrics,
    };
  }

  /**
   * Obtiene estadísticas de rendimiento
   */
  async getPerformanceStats(): Promise<{
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
    uptime: number;
  }> {
    // En un sistema real, esto vendría de métricas de APM
    return {
      averageResponseTime: 150, // ms
      totalRequests: 1000,
      errorRate: 0.02, // 2%
      uptime: process.uptime(),
    };
  }
}
