import { UAParser } from 'ua-parser-js';

/**
 * Helper para parsear User Agent y extraer información del dispositivo y navegador
 */

interface ParsedUserAgent {
  dispositivo: string;
  navegador: string;
}

/**
 * Extrae información del navegador del User Agent
 */
function extractBrowser(userAgent: string): string {
  const agent = new UAParser(userAgent);
  const browser = agent.getBrowser();

  if (browser.name && browser.version) {
    const majorVersion = browser.version.split('.')[0];
    return `${browser.name} ${majorVersion}`;
  }

  return browser.name || 'Desconocido';
}

/**
 * Extrae información del dispositivo del User Agent
 */
function extractDevice(userAgent: string): string {
  const agent = new UAParser(userAgent);
  const device = agent.getDevice();
  const os = agent.getOS();

  // Si hay información del dispositivo
  if (device.type === 'mobile') {
    if (os.name?.includes('Android')) {
      return 'Android Mobile';
    }
    if (device.vendor?.includes('Apple') || os.name?.includes('iOS')) {
      if (device.model?.includes('iPad')) {
        return 'iPad';
      }
      return 'iPhone';
    }
    return 'Mobile Device';
  }

  if (device.type === 'tablet') {
    if (os.name?.includes('Android')) {
      return 'Android Tablet';
    }
    if (device.vendor?.includes('Apple')) {
      return 'iPad';
    }
    return 'Tablet';
  }

  // Dispositivos de escritorio por sistema operativo
  if (os.name) {
    if (os.name.includes('Windows')) {
      const version = os.version;
      if (version) {
        if (version.startsWith('11')) return 'Windows 11';
        if (version.startsWith('10')) return 'Windows 10';
        if (version.startsWith('8.1')) return 'Windows 8.1';
        if (version.startsWith('8')) return 'Windows 8';
        if (version.startsWith('7')) return 'Windows 7';
      }
      return 'Windows';
    }
    if (os.name.includes('Mac OS')) {
      return 'macOS';
    }
    if (os.name.includes('Linux')) {
      return 'Linux';
    }
  }

  return 'Desconocido';
}

/**
 * Parsea el User Agent y retorna información estructurada
 */
export function parseUserAgent(userAgent?: string): ParsedUserAgent {
  if (!userAgent) {
    return {
      dispositivo: 'Desconocido',
      navegador: 'Desconocido',
    };
  }

  return {
    dispositivo: extractDevice(userAgent),
    navegador: extractBrowser(userAgent),
  };
}

/**
 * Obtiene la IP real del cliente considerando proxies y load balancers
 * Útil para clusters de Kubernetes y Docker
 */
export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  // Prioridad de headers para obtener la IP real
  const ipHeaders = [
    'x-forwarded-for', // Nginx, Apache, Load Balancers
    'x-real-ip', // Nginx
    'cf-connecting-ip', // Cloudflare
    'true-client-ip', // Cloudflare Enterprise
    'x-client-ip',
    'x-cluster-client-ip',
    'forwarded',
  ];

  for (const header of ipHeaders) {
    const value = headers[header];
    if (value) {
      // x-forwarded-for puede contener múltiples IPs separadas por comas
      // La primera es la IP original del cliente
      const ip = Array.isArray(value) ? value[0] : value;
      const firstIp = ip.split(',')[0].trim();
      if (firstIp && isValidIp(firstIp)) {
        return firstIp;
      }
    }
  }

  return 'Unknown';
}

/**
 * Valida si una cadena es una IP válida (IPv4 o IPv6)
 */
function isValidIp(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every((part) => parseInt(part) >= 0 && parseInt(part) <= 255);
  }

  // IPv6 (simplificado)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/;
  return ipv6Regex.test(ip);
}
