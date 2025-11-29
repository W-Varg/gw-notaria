import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

export interface NotificationEvent {
  type:
    | 'reserva_created'
    | 'reserva_expired'
    | 'reserva_cancelled'
    | 'pedido_created'
    | 'pedido_updated'
    | 'entrega_created'
    | 'entrega_updated'
    | 'resenia_created'
    | 'mensaje_contacto_created'
    | 'stock_alert'
    | 'stock_critical';
  data: {
    reservaId?: string;
    pedidoId?: string;
    entregaId?: string;
    reseniaId?: string;
    mensajeId?: string;
    usuarioId: string;
    usuarioEmail: string;
    usuarioNombre: string;
    expiraEn?: Date;
    items?: Array<{ productoId: string; cantidad: number; precio: number }>;
    estado?: string;
    montoTotal?: number;
    numeroPedido?: string;
    direccionEntrega?: string;
    nombreDestinatario?: string;
    asunto?: string;
    mensaje?: string;
    sucursalId?: string;
    sucursalNombre?: string;
    stockAlerts?: Array<{
      productoNombre: string;
      stockActual: number;
      stockMinimo: number;
      diferencia: number;
      porcentajeStock: number;
    }>;
  };
  timestamp: Date;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@crunchis.com';
    this.fromName = this.configService.get<string>('ENV_FROM_NAME') || 'Crunchis';
  }

  async sendNotification(event: NotificationEvent): Promise<void> {
    // Log del evento
    this.logger.log(`[${event.type}] Enviando notificación - Usuario ${event.data.usuarioId}`, {
      event,
      timestamp: event.timestamp.toISOString(),
    });

    try {
      const emailTemplate = this.generateEmailTemplate(event);
      await this.sendEmail(event.data.usuarioEmail, emailTemplate);
      this.logger.log(
        `Email enviado exitosamente para evento ${event.type} a ${event.data.usuarioEmail}`,
      );
    } catch (error) {
      this.logger.error(`Error enviando email: ${error.message}`, error.stack);
    }
  }

  private generateEmailTemplate(event: NotificationEvent): EmailTemplate {
    const { type, data } = event;

    switch (type) {
      case 'reserva_created':
        return {
          subject: `Reserva creada - Pet Shop`,
          html: `
            <h2>¡Reserva creada exitosamente!</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Tu reserva ha sido creada y expira el ${data.expiraEn?.toLocaleDateString()}.</p>
            <p>Reserva ID: ${data.reservaId}</p>
            <p>Gracias por elegir Pet Shop.</p>
          `,
          text: `Reserva creada exitosamente. Hola ${data.usuarioNombre}, tu reserva ha sido creada y expira el ${data.expiraEn?.toLocaleDateString()}. Reserva ID: ${data.reservaId}`,
        };

      case 'reserva_expired':
        return {
          subject: `Reserva expirada - Pet Shop`,
          html: `
            <h2>Tu reserva ha expirado</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Tu reserva ha expirado. Los productos han sido liberados para otros clientes.</p>
            <p>Reserva ID: ${data.reservaId}</p>
            <p>¡Esperamos verte pronto en Pet Shop!</p>
          `,
          text: `Tu reserva ha expirado. Hola ${data.usuarioNombre}, tu reserva ha expirado. Los productos han sido liberados para otros clientes. Reserva ID: ${data.reservaId}`,
        };

      case 'reserva_cancelled':
        return {
          subject: `Reserva cancelada - Pet Shop`,
          html: `
            <h2>Reserva cancelada</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Tu reserva ha sido cancelada exitosamente.</p>
            <p>Reserva ID: ${data.reservaId}</p>
            <p>¡Esperamos verte pronto en Pet Shop!</p>
          `,
          text: `Reserva cancelada. Hola ${data.usuarioNombre}, tu reserva ha sido cancelada exitosamente. Reserva ID: ${data.reservaId}`,
        };

      case 'pedido_created':
        return {
          subject: `Pedido creado - Pet Shop`,
          html: `
            <h2>¡Pedido creado exitosamente!</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Tu pedido ha sido creado y está siendo procesado.</p>
            <p>Número de pedido: ${data.numeroPedido}</p>
            <p>Total: $${data.montoTotal}</p>
            <p>Te notificaremos cuando esté listo para entrega.</p>
          `,
          text: `Pedido creado exitosamente. Hola ${data.usuarioNombre}, tu pedido ha sido creado. Número: ${data.numeroPedido}, Total: $${data.montoTotal}`,
        };

      case 'pedido_updated':
        return {
          subject: `Actualización de pedido - Pet Shop`,
          html: `
            <h2>Actualización de pedido</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Tu pedido ha sido actualizado.</p>
            <p>Número de pedido: ${data.numeroPedido}</p>
            <p>Estado actual: ${data.estado}</p>
            <p>Te mantendremos informado sobre el progreso.</p>
          `,
          text: `Actualización de pedido. Hola ${data.usuarioNombre}, tu pedido ${data.numeroPedido} ha sido actualizado. Estado: ${data.estado}`,
        };

      case 'entrega_created':
        return {
          subject: `Entrega programada - Pet Shop`,
          html: `
            <h2>¡Entrega programada!</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Tu entrega ha sido programada.</p>
            <p>Dirección: ${data.direccionEntrega}</p>
            <p>Destinatario: ${data.nombreDestinatario}</p>
            <p>Te notificaremos cuando esté en camino.</p>
          `,
          text: `Entrega programada. Hola ${data.usuarioNombre}, tu entrega ha sido programada para ${data.direccionEntrega}`,
        };

      case 'entrega_updated':
        return {
          subject: `Actualización de entrega - Pet Shop`,
          html: `
            <h2>Actualización de entrega</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>El estado de tu entrega ha sido actualizado.</p>
            <p>Estado actual: ${data.estado}</p>
            <p>Dirección: ${data.direccionEntrega}</p>
            <p>Te mantendremos informado sobre el progreso.</p>
          `,
          text: `Actualización de entrega. Hola ${data.usuarioNombre}, el estado de tu entrega ha sido actualizado. Estado: ${data.estado}`,
        };

      case 'resenia_created':
        return {
          subject: `Reseña recibida - Pet Shop`,
          html: `
            <h2>¡Gracias por tu reseña!</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Hemos recibido tu reseña y está siendo revisada por nuestro equipo.</p>
            <p>Una vez aprobada, será visible para otros clientes.</p>
            <p>¡Gracias por ayudarnos a mejorar!</p>
          `,
          text: `Reseña recibida. Hola ${data.usuarioNombre}, hemos recibido tu reseña y está siendo revisada.`,
        };

      case 'mensaje_contacto_created':
        return {
          subject: `Mensaje de contacto recibido - Pet Shop`,
          html: `
            <h2>Mensaje de contacto recibido</h2>
            <p>Hola ${data.usuarioNombre},</p>
            <p>Hemos recibido tu mensaje de contacto.</p>
            <p>Asunto: ${data.asunto}</p>
            <p>Nos pondremos en contacto contigo pronto.</p>
            <p>¡Gracias por contactarnos!</p>
          `,
          text: `Mensaje de contacto recibido. Hola ${data.usuarioNombre}, hemos recibido tu mensaje: ${data.asunto}`,
        };

      default:
        return {
          subject: `Notificación - Pet Shop`,
          html: `<h2>Notificación</h2><p>Hola ${data.usuarioNombre}, tienes una nueva notificación.</p>`,
          text: `Notificación. Hola ${data.usuarioNombre}, tienes una nueva notificación.`,
        };
    }
  }

  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    try {
      // Usar el servicio de email real
      const success = await this.emailService.sendEmail(to, template);

      if (success) {
        this.logger.log(`📧 Email enviado exitosamente a ${to}`);
      } else {
        this.logger.error(`📧 Error al enviar email a ${to}`);
      }
    } catch (error) {
      this.logger.error(`📧 Error al enviar email a ${to}:`, error);

      // Fallback a simulación si falla el servicio real
      this.logger.warn(`📧 [FALLBACK] Simulando envío de email a ${to}`);
      console.log('\n' + '='.repeat(80));
      console.log('📧 EMAIL NOTIFICATION (FALLBACK)');
      console.log('='.repeat(80));
      console.log(`From: ${this.fromName} <${this.fromEmail}>`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${template.subject}`);
      console.log('\n--- HTML CONTENT ---');
      console.log(template.html);
      console.log('\n--- TEXT CONTENT ---');
      console.log(template.text);
      console.log('='.repeat(80) + '\n');
    }
  }

  // Métodos para reservas
  async notifyReservaCreated(
    reservaId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
    expiraEn: Date,
    items: Array<{ productoId: string; cantidad: number; precio: number }>,
  ): Promise<void> {
    await this.sendNotification({
      type: 'reserva_created',
      data: { reservaId, usuarioId, usuarioEmail, usuarioNombre, expiraEn, items },
      timestamp: new Date(),
    });
  }

  async notifyReservaExpired(
    reservaId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'reserva_expired',
      data: { reservaId, usuarioId, usuarioEmail, usuarioNombre },
      timestamp: new Date(),
    });
  }

  async notifyReservaCancelled(
    reservaId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'reserva_cancelled',
      data: { reservaId, usuarioId, usuarioEmail, usuarioNombre },
      timestamp: new Date(),
    });
  }

  // Métodos para pedidos
  async notifyPedidoCreated(
    pedidoId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
    numeroPedido: string,
    montoTotal: number,
  ): Promise<void> {
    await this.sendNotification({
      type: 'pedido_created',
      data: { pedidoId, usuarioId, usuarioEmail, usuarioNombre, numeroPedido, montoTotal },
      timestamp: new Date(),
    });
  }

  async notifyPedidoUpdated(
    pedidoId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
    numeroPedido: string,
    estado: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'pedido_updated',
      data: { pedidoId, usuarioId, usuarioEmail, usuarioNombre, numeroPedido, estado },
      timestamp: new Date(),
    });
  }

  // Métodos para entregas
  async notifyEntregaCreated(
    entregaId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
    direccionEntrega: string,
    nombreDestinatario: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'entrega_created',
      data: {
        entregaId,
        usuarioId,
        usuarioEmail,
        usuarioNombre,
        direccionEntrega,
        nombreDestinatario,
      },
      timestamp: new Date(),
    });
  }

  async notifyEntregaUpdated(
    entregaId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
    direccionEntrega: string,
    estado: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'entrega_updated',
      data: { entregaId, usuarioId, usuarioEmail, usuarioNombre, direccionEntrega, estado },
      timestamp: new Date(),
    });
  }

  // Métodos para reseñas
  async notifyReseniaCreated(
    reseniaId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'resenia_created',
      data: { reseniaId: reseniaId, usuarioId, usuarioEmail, usuarioNombre },
      timestamp: new Date(),
    });
  }

  // Métodos para mensajes de contacto
  async notifyMensajeContactoCreated(
    mensajeId: string,
    usuarioId: string,
    usuarioEmail: string,
    usuarioNombre: string,
    asunto: string,
  ): Promise<void> {
    await this.sendNotification({
      type: 'mensaje_contacto_created',
      data: { mensajeId, usuarioId, usuarioEmail, usuarioNombre, asunto },
      timestamp: new Date(),
    });
  }

  // Métodos para alertas de stock
  async notifyStockAlert(
    sucursalId: string,
    sucursalNombre: string,
    stockAlerts: Array<{
      productoNombre: string;
      stockActual: number;
      stockMinimo: number;
      diferencia: number;
      porcentajeStock: number;
    }>,
  ): Promise<void> {
    await this.sendNotification({
      type: 'stock_alert',
      data: {
        sucursalId,
        sucursalNombre,
        stockAlerts,
        usuarioId: 'system',
        usuarioEmail: 'admin@sistema.com',
        usuarioNombre: 'Sistema de Alertas',
      },
      timestamp: new Date(),
    });
  }

  async notifyCriticalStock(
    sucursalId: string,
    sucursalNombre: string,
    stockAlerts: Array<{
      productoNombre: string;
      stockActual: number;
      stockMinimo: number;
      diferencia: number;
      porcentajeStock: number;
    }>,
  ): Promise<void> {
    await this.sendNotification({
      type: 'stock_critical',
      data: {
        sucursalId,
        sucursalNombre,
        stockAlerts,
        usuarioId: 'system',
        usuarioEmail: 'admin@sistema.com',
        usuarioNombre: 'Sistema de Alertas',
      },
      timestamp: new Date(),
    });
  }

  private getStockAlertTemplate(
    sucursalNombre: string,
    stockAlerts: Array<{
      productoNombre: string;
      stockActual: number;
      stockMinimo: number;
      diferencia: number;
      porcentajeStock: number;
    }>,
  ): EmailTemplate {
    const alertList = stockAlerts
      .map(
        (alert) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${alert.productoNombre}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${alert.stockActual}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${alert.stockMinimo}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${alert.diferencia}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${alert.porcentajeStock}%</td>
        </tr>
      `,
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">⚠️ Alerta de Stock Bajo</h2>
        <p>Se ha detectado stock bajo en la sucursal <strong>${sucursalNombre}</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Producto</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stock Actual</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stock Mínimo</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Diferencia</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">% Stock</th>
            </tr>
          </thead>
          <tbody>
            ${alertList}
          </tbody>
        </table>
        
        <p style="color: #666; font-size: 14px;">
          Por favor, revise el inventario y considere realizar un reabastecimiento.
        </p>
      </div>
    `;

    const text = `
      Alerta de Stock Bajo - ${sucursalNombre}
      
      Los siguientes productos tienen stock bajo:
      
      ${stockAlerts
        .map(
          (alert) => `
      - ${alert.productoNombre}
        Stock actual: ${alert.stockActual}
        Stock mínimo: ${alert.stockMinimo}
        Diferencia: ${alert.diferencia}
        Porcentaje: ${alert.porcentajeStock}%
      `,
        )
        .join('')}
      
      Por favor, revise el inventario y considere realizar un reabastecimiento.
    `;

    return {
      subject: `⚠️ Alerta de Stock Bajo - ${sucursalNombre}`,
      html,
      text,
    };
  }
}
