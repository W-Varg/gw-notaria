import { Injectable } from '@nestjs/common';
import { toDataURL } from 'qrcode';

/**
 * Servicio global para generación de códigos QR
 * Puede ser usado en toda la aplicación para diferentes propósitos
 */
@Injectable()
export class QrCodeService {
  /**
   * Genera un código QR como Data URL (base64)
   * @param data - Datos a codificar en el QR
   * @param options - Opciones adicionales para la generación
   * @returns Data URL del código QR generado
   */
  async generateQrCodeDataUrl(
    data: string,
    options?: {
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
      type?: 'image/png' | 'image/jpeg' | 'image/webp';
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    },
  ): Promise<string> {
    const defaultOptions = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      width: 300,
      margin: 1,
      ...options,
    };

    return await toDataURL(data, defaultOptions);
  }

  /**
   * Genera un código QR para autenticación 2FA
   * @param email - Email del usuario
   * @param appName - Nombre de la aplicación
   * @param secret - Secreto TOTP
   * @returns Data URL del código QR
   */
  async generate2FAQrCode(email: string, appName: string, secret: string): Promise<string> {
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(appName)}`;

    return await this.generateQrCodeDataUrl(otpauthUrl, {
      errorCorrectionLevel: 'H',
      width: 300,
    });
  }

  /**
   * Genera un código QR para un enlace de verificación
   * @param verificationUrl - URL de verificación
   * @returns Data URL del código QR
   */
  async generateVerificationQrCode(verificationUrl: string): Promise<string> {
    return await this.generateQrCodeDataUrl(verificationUrl, {
      errorCorrectionLevel: 'M',
      width: 250,
    });
  }

  /**
   * Genera un código QR para información de contacto (vCard)
   * @param contactInfo - Información de contacto
   * @returns Data URL del código QR
   */
  async generateContactQrCode(contactInfo: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
  }): Promise<string> {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contactInfo.name}`,
      `EMAIL:${contactInfo.email}`,
      contactInfo.phone ? `TEL:${contactInfo.phone}` : '',
      contactInfo.organization ? `ORG:${contactInfo.organization}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    return await this.generateQrCodeDataUrl(vCard, {
      errorCorrectionLevel: 'M',
      width: 300,
    });
  }

  /**
   * Genera un código QR para un enlace web simple
   * @param url - URL a codificar
   * @returns Data URL del código QR
   */
  async generateUrlQrCode(url: string): Promise<string> {
    return await this.generateQrCodeDataUrl(url, {
      errorCorrectionLevel: 'L',
      width: 250,
    });
  }

  /**
   * Genera un código QR para texto plano
   * @param text - Texto a codificar
   * @returns Data URL del código QR
   */
  async generateTextQrCode(text: string): Promise<string> {
    return await this.generateQrCodeDataUrl(text, {
      errorCorrectionLevel: 'M',
      width: 300,
    });
  }
}
