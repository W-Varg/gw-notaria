import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('✅ Servicio de email configurado correctamente');
  }

  /**
   * Enviar email de verificación de registro
   */
  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('appFrontUrlBase');
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${token}`;

    return this.sendEmail({
      to: email,
      subject: 'Verifica tu cuenta - Tu Notaría',
      template: 'verification',
      context: {
        name,
        verificationLink,
      },
    });
  }

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🎉 Bienvenido a Tu Notaría',
      template: 'welcome',
      context: {
        name,
      },
    });
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendResetPasswordEmail(email: string, name: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('appFrontUrlBase');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

    return this.sendEmail({
      to: email,
      subject: '🔐 Recuperación de contraseña - Tu Notaría',
      template: 'reset-password',
      context: {
        name,
        resetLink,
      },
    });
  }

  /**
   * Enviar email con código 2FA
   */
  async send2FASetupEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🔒 Autenticación de dos factores activada',
      template: '2fa-setup',
      context: {
        name,
      },
    });
  }

  /**
   * Método genérico para enviar emails con templates de Handlebars
   */
  private async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }): Promise<boolean> {
    const emailUser = this.configService.get<string>('emailUser');
    const emailPass = this.configService.get<string>('emailPass');

    // Si no hay credenciales configuradas, simular envío
    if (!emailUser || !emailPass) {
      this.logger.warn('Credenciales de email no configuradas. Simulando envío...');
      this.logger.log(`\n${'='.repeat(80)}`);
      this.logger.log(`📧 EMAIL SIMULADO`);
      this.logger.log(`${'='.repeat(80)}`);
      this.logger.log(`Para: ${options.to}`);
      this.logger.log(`Asunto: ${options.subject}`);
      this.logger.log(`Template: ${options.template}.hbs`);
      this.logger.log(`Contexto:`, JSON.stringify(options.context, null, 2));
      this.logger.log(`${'='.repeat(80)}\n`);
      return false;
    }

    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });

      this.logger.log(`📧 Email enviado exitosamente a: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error al enviar email a ${options.to}:`, error.message);
      return false;
    }
  }
}
