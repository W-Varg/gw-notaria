import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';

import { PrismaPg } from '@prisma/adapter-pg'; // Driver Adapter for Postgres

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 3000; // 3 segundos
  private isConnected = false;

  constructor() {
    const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    super({ adapter: pool, omit: { usuario: { password: true } } });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.logger.log('Desconectado de la base de datos');
    }
  }

  /**
   * Conecta a la base de datos con lógica de reintentos
   */
  private async connectWithRetry(): Promise<void> {
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        attempt++;
        this.logger.log(`Intento ${attempt}/${this.maxRetries} de conexión a la base de datos...`);

        await this.$connect();

        // Verificar que la conexión funcione con una query simple
        await this.$queryRaw`SELECT 1`;

        this.isConnected = true;
        this.logger.log('Conexión a la base de datos establecida exitosamente');
        return;
      } catch (error) {
        this.logger.error(`Error en intento ${attempt}/${this.maxRetries}: ${error.message}`);

        if (attempt >= this.maxRetries) {
          this.logger.error(
            'No se pudo establecer conexión con la base de datos después de varios intentos',
          );
          this.logger.error('El servidor no puede iniciar sin conexión a la base de datos');

          // Lanzar error para detener el inicio del servidor
          throw new Error(
            `No se pudo conectar a la base de datos después de ${this.maxRetries} intentos: ${error.message}`,
          );
        }

        // Esperar antes del siguiente intento
        this.logger.warn(
          `⏳ Esperando ${this.retryDelay / 1000} segundos antes del siguiente intento...`,
        );
        await this.sleep(this.retryDelay);
      }
    }
  }

  /**
   * Verifica si la conexión a la base de datos está activa
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error(`Error al verificar conexión: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtiene el estado de la conexión
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Función auxiliar para esperar
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
