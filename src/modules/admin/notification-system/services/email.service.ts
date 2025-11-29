import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailTemplate } from './notification.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const emailConfig: SMTPTransport.Options = {
      host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get('EMAIL_PORT') || 587,
      secure: false, // true for 465, false for other ports
      service: this.configService.get('EMAIL_SERVICE') || 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM') || 'noreply@crunchis.com',
        to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado exitosamente a ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email a ${to}:`, error);
      return false;
    }
  }

  async sendBulkEmail(
    recipients: string[],
    template: EmailTemplate,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await this.sendEmail(recipient, template);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    this.logger.log(`Bulk email completado: ${success} exitosos, ${failed} fallidos`);
    return { success, failed };
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión de email verificada exitosamente');
      return true;
    } catch (error) {
      this.logger.error('Error al verificar conexión de email:', error);
      return false;
    }
  }

  async sendTestEmail(to: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Test Email - Sistema de Notificaciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">✅ Test de Email Exitoso</h2>
          <p>Este es un email de prueba del sistema de notificaciones.</p>
          <p>Si recibes este email, la configuración de email está funcionando correctamente.</p>
          <p style="color: #666; font-size: 14px;">
            Enviado el: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      text: `
        Test de Email Exitoso
        
        Este es un email de prueba del sistema de notificaciones.
        
        Si recibes este email, la configuración de email está funcionando correctamente.
        
        Enviado el: ${new Date().toLocaleString()}
      `,
    };

    return await this.sendEmail(to, template);
  }
}
