import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailService = this.configService.get<string>('emailService');
    const emailUser = this.configService.get<string>('emailUser');
    const emailPass = this.configService.get<string>('emailPass');

    if (!emailUser || !emailPass) {
      this.logger.warn('Email credentials not configured. Email functionality will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Verificar conexión
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error al configurar el servicio de email:', error);
      } else {
        // this.logger.log('Servicio de email configurado correctamente');
      }
    });
  }

  /**
   * Enviar email de verificación de registro
   */
  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('appFrontUrlBase');
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${token}`;

    const htmlContent = this.getVerificationEmailTemplate(name, verificationLink);

    return this.sendEmail({
      to: email,
      subject: 'Verifica tu cuenta - Tu Notaría',
      html: htmlContent,
    });
  }

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const htmlContent = this.getWelcomeEmailTemplate(name);

    return this.sendEmail({
      to: email,
      subject: '🎉 Bienvenido a Tu Notaría',
      html: htmlContent,
    });
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendResetPasswordEmail(email: string, name: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('appFrontUrlBase');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

    const htmlContent = this.getResetPasswordEmailTemplate(name, resetLink);

    return this.sendEmail({
      to: email,
      subject: '🔐 Recuperación de contraseña - Tu Notaría',
      html: htmlContent,
    });
  }

  /**
   * Enviar email con código 2FA
   */
  async send2FASetupEmail(email: string, name: string): Promise<boolean> {
    const htmlContent = this.get2FASetupEmailTemplate(name);

    return this.sendEmail({
      to: email,
      subject: '🔒 Autenticación de dos factores activada',
      html: htmlContent,
    });
  }

  /**
   * Método genérico para enviar emails
   */
  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('Transporter no configurado. No se puede enviar email.');
      this.logger.log(`\n${'='.repeat(80)}`);
      this.logger.log(`📧 EMAIL SIMULADO`);
      this.logger.log(`${'='.repeat(80)}`);
      this.logger.log(`Para: ${options.to}`);
      this.logger.log(`Asunto: ${options.subject}`);
      this.logger.log(`${'='.repeat(80)}\n`);
      return false;
    }

    try {
      const emailFrom = this.configService.get<string>('emailFrom');

      await this.transporter.sendMail({
        from: `"Tu Notaría" <${emailFrom}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      this.logger.log(`Email enviado exitosamente a: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email a ${options.to}:`, error);
      return false;
    }
  }

  // ============================================
  // PLANTILLAS HTML DE EMAILS
  // ============================================

  private getVerificationEmailTemplate(name: string, verificationLink: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifica tu cuenta</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          line-height: 1.6;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          margin: 30px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 16px;
        }
        .button:hover {
          opacity: 0.9;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
        .alternative-link {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
          word-break: break-all;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verifica tu cuenta</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>Gracias por registrarte en <strong>Tu Notaría</strong>.</p>
          <p>Para completar tu registro y verificar tu dirección de correo electrónico, haz clic en el siguiente botón:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verificar mi cuenta</a>
          </div>
          <p>Este enlace es válido por 24 horas.</p>
          <div class="alternative-link">
            <strong>Si el botón no funciona, copia y pega este enlace en tu navegador:</strong><br>
            ${verificationLink}
          </div>
          <p><strong>⚠️ Nota:</strong> Si no creaste esta cuenta, puedes ignorar este correo.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tu Notaría. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          line-height: 1.6;
          font-size: 16px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }
        .feature-list li {
          padding: 10px 0;
          color: #555;
          font-size: 16px;
        }
        .feature-list li:before {
          content: "✓ ";
          color: #11998e;
          font-weight: bold;
          margin-right: 10px;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Bienvenido!</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>Nos complace darte la bienvenida a <strong>Tu Notaría</strong>.</p>
          <p>Tu cuenta ha sido verificada exitosamente. Ahora puedes disfrutar de todos nuestros servicios:</p>
          <ul class="feature-list">
            <li>Gestión de documentos notariales</li>
            <li>Seguimiento de trámites en tiempo real</li>
            <li>Notificaciones automáticas</li>
            <li>Soporte personalizado</li>
          </ul>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          <p>¡Gracias por confiar en nosotros!</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tu Notaría. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private getResetPasswordEmailTemplate(name: string, resetLink: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperar contraseña</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          line-height: 1.6;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          margin: 30px 0;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 16px;
        }
        .button:hover {
          opacity: 0.9;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
        .warning-box {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alternative-link {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
          word-break: break-all;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Recuperar contraseña</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Tu Notaría</strong>.</p>
          <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Restablecer contraseña</a>
          </div>
          <p>Este enlace es válido por 1 hora por razones de seguridad.</p>
          <div class="alternative-link">
            <strong>Si el botón no funciona, copia y pega este enlace en tu navegador:</strong><br>
            ${resetLink}
          </div>
          <div class="warning-box">
            <strong>⚠️ Importante:</strong> Si no solicitaste este cambio, ignora este correo. Tu contraseña actual permanecerá sin cambios.
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tu Notaría. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private get2FASetupEmailTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>2FA Activado</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          line-height: 1.6;
          font-size: 16px;
        }
        .info-box {
          background-color: #e8f4fd;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Autenticación de dos factores</h1>
        </div>
        <div class="content">
          <h2>¡Hola ${name}!</h2>
          <p>Te confirmamos que has activado exitosamente la <strong>autenticación de dos factores (2FA)</strong> en tu cuenta de Tu Notaría.</p>
          <div class="info-box">
            <strong>✓</strong> Tu cuenta ahora tiene una capa adicional de seguridad. Cada vez que inicies sesión, necesitarás proporcionar un código de verificación desde tu aplicación de autenticación.
          </div>
          <p>Esto ayuda a proteger tu cuenta incluso si alguien conoce tu contraseña.</p>
          <p>Si no activaste esta función o tienes alguna pregunta sobre seguridad, contáctanos inmediatamente.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tu Notaría. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
