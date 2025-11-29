import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WebhookEvent {
  type: string;
  data: any;
  timestamp: Date;
  source: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  timeout?: number;
  retries?: number;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly webhookUrl: string;
  private readonly webhookSecret: string;
  private readonly timeout: number;
  private readonly retries: number;

  constructor(private readonly configService: ConfigService) {
    this.webhookUrl = this.configService.get('WEBHOOK_URL') || '';
    this.webhookSecret = this.configService.get('WEBHOOK_SECRET') || '';
    this.timeout = parseInt(this.configService.get('WEBHOOK_TIMEOUT') || '5000');
    this.retries = parseInt(this.configService.get('WEBHOOK_RETRIES') || '3');
  }

  async sendWebhook(event: WebhookEvent): Promise<boolean> {
    if (!this.webhookUrl) {
      this.logger.warn('Webhook URL no configurada, saltando envío');
      return false;
    }

    try {
      const payload = {
        ...event,
        signature: this.generateSignature(event),
      };

      await this.sendWithRetry(payload);
      this.logger.log(`Webhook enviado exitosamente: ${event.type}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar webhook: ${event.type}`, error);
      return false;
    }
  }

  private async sendWithRetry(payload: any, attempt: number = 1): Promise<void> {
    try {
      const response = await axios.post(this.webhookUrl, payload, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PetShop-Webhook/1.0',
          ...(this.webhookSecret && { 'X-Webhook-Secret': this.webhookSecret }),
        },
      });

      if (response.status >= 200 && response.status < 300) {
        this.logger.log(`Webhook enviado exitosamente (intento ${attempt})`);
        return;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (attempt < this.retries) {
        this.logger.warn(`Intento ${attempt} fallido, reintentando...`, error.message);
        await this.delay(1000 * attempt); // Backoff exponencial
        return this.sendWithRetry(payload, attempt + 1);
      }

      throw error;
    }
  }

  private generateSignature(event: WebhookEvent): string {
    if (!this.webhookSecret) return '';

    const crypto = require('crypto');
    const payload = JSON.stringify(event);
    return crypto.createHmac('sha256', this.webhookSecret).update(payload).digest('hex');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Métodos específicos para diferentes tipos de eventos
  async sendPedidoWebhook(pedidoId: string, estado: string, montoTotal: number): Promise<boolean> {
    return this.sendWebhook({
      type: 'pedido.updated',
      data: { pedidoId, estado, montoTotal },
      timestamp: new Date(),
      source: 'petshop-backend',
    });
  }

  async sendStockWebhook(
    sucursalId: string,
    productoId: string,
    stockActual: number,
    stockMinimo: number,
  ): Promise<boolean> {
    return this.sendWebhook({
      type: 'stock.low',
      data: { sucursalId, productoId, stockActual, stockMinimo },
      timestamp: new Date(),
      source: 'petshop-backend',
    });
  }

  async sendReservaWebhook(reservaId: string, estado: string, expiraEn: Date): Promise<boolean> {
    return this.sendWebhook({
      type: 'reserva.updated',
      data: { reservaId, estado, expiraEn },
      timestamp: new Date(),
      source: 'petshop-backend',
    });
  }

  async sendEntregaWebhook(
    entregaId: string,
    estado: string,
    direccionEntrega: string,
  ): Promise<boolean> {
    return this.sendWebhook({
      type: 'entrega.updated',
      data: { entregaId, estado, direccionEntrega },
      timestamp: new Date(),
      source: 'petshop-backend',
    });
  }

  async testWebhook(): Promise<boolean> {
    return this.sendWebhook({
      type: 'test',
      data: { message: 'Test webhook from PetShop Backend' },
      timestamp: new Date(),
      source: 'petshop-backend',
    });
  }
}
